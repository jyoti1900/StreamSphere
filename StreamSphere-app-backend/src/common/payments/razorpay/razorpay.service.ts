import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';

@Injectable()
export class RazorpayService {
  private readonly razorpay: Razorpay | null;
  private readonly keyId: string;
  private readonly keySecret: string;
  private readonly webhookSecret: string;

  constructor(private readonly configService: ConfigService) {
    const razorpayConfig = this.configService.get('razorpay') ?? {};
    this.keyId = razorpayConfig.keyId ?? '';
    this.keySecret = razorpayConfig.keySecret ?? '';
    this.webhookSecret = razorpayConfig.webhookSecret ?? '';

    this.razorpay =
      this.keyId && this.keySecret
        ? new Razorpay({
            key_id: this.keyId,
            key_secret: this.keySecret,
          })
        : null;
  }

  private ensureConfigured(): Razorpay {
    if (!this.razorpay) {
      throw new InternalServerErrorException(
        'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env',
      );
    }

    return this.razorpay;
  }

  getKeyId(): string {
    this.ensureConfigured();
    return this.keyId;
  }

  async createOrder(options: {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, string>;
  }) {
    const razorpay = this.ensureConfigured();

    return razorpay.orders.create({
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      notes: options.notes,
    });
  }

  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): boolean {
    this.ensureConfigured();

    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return expectedSignature === signature;
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!this.webhookSecret) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex');

    return expectedSignature === signature;
  }

  async fetchPayment(paymentId: string) {
    const razorpay = this.ensureConfigured();
    return razorpay.payments.fetch(paymentId);
  }
}
