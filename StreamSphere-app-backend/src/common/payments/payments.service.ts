import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RazorpayService } from './razorpay/razorpay.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import {
  PaymentOrder,
  PaymentOrderDocument,
  PaymentOrderStatus,
} from './schema/payment-order.schema';
import {
  getSubscriptionPlan,
  SUBSCRIPTION_PLANS,
  toPaise,
  buildOrderSummary,
  toPlanWithOrderSummary,
} from './constants/subscription-plans.constant';
import { User, UserDocument } from '../../users/schema/users.schema';
import { buildPaymentDetailView } from './utils/payment-format.util';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly razorpayService: RazorpayService,
    @InjectModel(PaymentOrder.name)
    private readonly paymentOrderModel: Model<PaymentOrderDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  getPlans() {
    return SUBSCRIPTION_PLANS.map(toPlanWithOrderSummary);
  }

  getOrderSummary(planId: string) {
    const plan = getSubscriptionPlan(planId);

    if (!plan) {
      throw new BadRequestException('Invalid subscription plan');
    }

    return buildOrderSummary(plan);
  }

  async createOrder(userId: string, payload: CreateOrderDto) {
    const plan = getSubscriptionPlan(payload.planId);

    if (!plan) {
      throw new BadRequestException('Invalid subscription plan');
    }

    const userObjectId = new Types.ObjectId(userId);
    const receipt = `rcpt_${userId}_${Date.now()}`;

    const razorpayOrder = await this.razorpayService.createOrder({
      amount: toPaise(plan.grandTotal),
      currency: plan.currency,
      receipt,
      notes: {
        userId,
        planId: plan.id,
      },
    });

    await this.paymentOrderModel.create({
      user: userObjectId,
      razorpayOrderId: razorpayOrder.id,
      amount: plan.grandTotal,
      currency: plan.currency,
      planId: plan.id,
      receipt,
      status: PaymentOrderStatus.CREATED,
    });

    return {
      keyId: this.razorpayService.getKeyId(),
      orderId: razorpayOrder.id,
      amount: toPaise(plan.grandTotal),
      currency: plan.currency,
      orderSummary: buildOrderSummary(plan),
      plan: {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        originalAmount: plan.originalAmount,
        discountPercent: plan.discountPercent,
        discountAmount: plan.discountAmount,
        grandTotal: plan.grandTotal,
      },
    };
  }

  async verifyPayment(userId: string, payload: VerifyPaymentDto) {
    const isValid = this.razorpayService.verifyPaymentSignature(
      payload.razorpayOrderId,
      payload.razorpayPaymentId,
      payload.razorpaySignature,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid payment signature');
    }

    const order = await this.paymentOrderModel.findOne({
      razorpayOrderId: payload.razorpayOrderId,
      user: new Types.ObjectId(userId),
    });

    if (!order) {
      throw new NotFoundException('Payment order not found');
    }

    if (order.status === PaymentOrderStatus.PAID) {
      return {
        message: 'Payment already verified',
        planId: order.planId,
        subscriptionExpiresAt: await this.getUserSubscriptionExpiry(userId),
      };
    }

    await this.markOrderPaid(order, payload.razorpayPaymentId);

    const subscriptionExpiresAt = await this.activateSubscription(
      userId,
      order.planId,
    );

    return {
      message: 'Payment verified successfully',
      planId: order.planId,
      subscriptionExpiresAt,
    };
  }

  async getAllPaymentDetails() {
    const orders = await this.paymentOrderModel
      .find()
      .populate({
        path: 'user',
        select: ['firstName', 'lastName', 'email'],
        match: { isDeleted: false },
      })
      .sort({ createdAt: -1 })
      .lean();

    return orders
      .filter((order) => order.user)
      .map((order) => {
        const user = order.user as any;

        return buildPaymentDetailView({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          amount: order.amount,
          currency: order.currency,
          paymentMethod: order.paymentMethod,
          status: order.status,
          createdAt: (order as any).createdAt,
        });
      });
  }

  async getPlanHistory(userId: string) {
    const user = await this.userModel
      .findOne({ _id: userId, isDeleted: false })
      .select('firstName lastName email')
      .lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const orders = await this.paymentOrderModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean();

    return orders.map((order) =>
      buildPaymentDetailView({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        amount: order.amount,
        currency: order.currency,
        paymentMethod: order.paymentMethod,
        status: order.status,
        createdAt: (order as any).createdAt,
      }),
    );
  }

  private async resolvePaymentMethod(
    paymentId: string,
    methodFromWebhook?: string,
  ): Promise<string | undefined> {
    if (methodFromWebhook?.trim()) {
      return methodFromWebhook.trim();
    }

    try {
      const payment = await this.razorpayService.fetchPayment(paymentId);
      return (payment as { method?: string }).method;
    } catch {
      return undefined;
    }
  }

  async handleWebhook(rawBody: string, signature?: string) {
    if (!signature) {
      throw new UnauthorizedException('Missing Razorpay webhook signature');
    }

    const isValid = this.razorpayService.verifyWebhookSignature(
      rawBody,
      signature,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const event = JSON.parse(rawBody);
    const eventType = event?.event;

    if (eventType === 'payment.captured') {
      const payment = event?.payload?.payment?.entity;
      const orderId = payment?.order_id;
      const paymentId = payment?.id;

      if (orderId && paymentId) {
        const order = await this.paymentOrderModel.findOne({
          razorpayOrderId: orderId,
        });

        if (order && order.status !== PaymentOrderStatus.PAID) {
          const paymentMethod = await this.resolvePaymentMethod(
            paymentId,
            payment?.method,
          );
          await this.markOrderPaid(order, paymentId, paymentMethod);
          await this.activateSubscription(
            order.user.toString(),
            order.planId,
          );
        }
      }
    }

    return { received: true };
  }

  private async markOrderPaid(
    order: PaymentOrderDocument,
    razorpayPaymentId: string,
    paymentMethod?: string,
  ) {
    if (!order.paymentMethod && paymentMethod) {
      order.paymentMethod = paymentMethod;
    } else if (!order.paymentMethod) {
      order.paymentMethod = await this.resolvePaymentMethod(razorpayPaymentId);
    }

    order.status = PaymentOrderStatus.PAID;
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();
  }

  private async activateSubscription(userId: string, planId: string) {
    const plan = getSubscriptionPlan(planId);

    if (!plan) {
      throw new BadRequestException('Invalid subscription plan');
    }

    const user = await this.userModel.findOne({
      _id: userId,
      isDeleted: false,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const now = new Date();
    const currentExpiry = user.subscriptionExpiresAt;
    const baseDate =
      currentExpiry && currentExpiry > now ? currentExpiry : now;

    const subscriptionExpiresAt = new Date(baseDate);
    subscriptionExpiresAt.setDate(
      subscriptionExpiresAt.getDate() + plan.durationDays,
    );

    user.subscriptionPlan = plan.id;
    user.subscriptionExpiresAt = subscriptionExpiresAt;
    await user.save();

    return subscriptionExpiresAt;
  }

  private async getUserSubscriptionExpiry(userId: string) {
    const user = await this.userModel
      .findOne({ _id: userId, isDeleted: false })
      .select('subscriptionExpiresAt')
      .lean();

    return user?.subscriptionExpiresAt ?? null;
  }
}
