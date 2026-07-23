import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../../users/schema/users.schema';

export type PaymentOrderDocument = PaymentOrder & Document;

export enum PaymentOrderStatus {
  CREATED = 'created',
  PAID = 'paid',
  FAILED = 'failed',
}

@Schema({
  collection: 'payment_orders',
  timestamps: true,
  versionKey: false,
})
export class PaymentOrder {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user!: Types.ObjectId;

  @Prop({ required: true, unique: true })
  razorpayOrderId!: string;

  @Prop({ default: null })
  razorpayPaymentId?: string;

  @Prop({ required: true })
  amount!: number;

  @Prop({ default: 'INR' })
  currency!: string;

  @Prop({ required: true })
  planId!: string;

  @Prop({ required: true })
  receipt!: string;

  @Prop({
    enum: PaymentOrderStatus,
    default: PaymentOrderStatus.CREATED,
  })
  status!: PaymentOrderStatus;

  @Prop({ default: null })
  paymentMethod?: string;
}

export const PaymentOrderSchema =
  SchemaFactory.createForClass(PaymentOrder);

PaymentOrderSchema.index({ user: 1, createdAt: -1 });
PaymentOrderSchema.index({ status: 1 });
