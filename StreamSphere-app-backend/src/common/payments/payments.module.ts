import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { RazorpayService } from './razorpay/razorpay.service';
import { PaymentsAuthMiddleware } from './middleware/payments-auth.middleware';
import {
  PaymentOrder,
  PaymentOrderSchema,
} from './schema/payment-order.schema';
import { User, UserSchema } from '../../users/schema/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentOrder.name, schema: PaymentOrderSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, RazorpayService, PaymentsAuthMiddleware],
  exports: [PaymentsService],
})
export class PaymentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaymentsAuthMiddleware)
      .exclude(
        { path: 'payments/webhook', method: RequestMethod.POST },
        { path: 'payments/plans', method: RequestMethod.GET },
        { path: 'payments/list', method: RequestMethod.GET },
        { path: 'payments/order-summary', method: RequestMethod.GET },
      )
      .forRoutes(PaymentsController);
  }
}
