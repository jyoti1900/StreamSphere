import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

@Schema({
  collection: 'users',
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  firstName: string;

  @Prop({
    required: true,
    trim: true,
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    unique: true,
  })
  phone: string;

  @Prop({
    required: true,
    select: false, // hide password by default
  })
  password: string;

  @Prop({
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Prop({
    default: 0,
  })
  passwordResetTokenVersion: number;

  @Prop({
    default: null,
  })
  lastLoginAt?: Date;

  @Prop({
    default: false
  })
  isDeleted: boolean;

  @Prop({ default: null })
  subscriptionPlan?: string;

  @Prop({ default: null })
  subscriptionExpiresAt?: Date;
}


export const UserSchema = SchemaFactory.createForClass(User);

/* AUTO HASH PASSWORD BEFORE SAVE */
UserSchema.pre<UserDocument>('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 10);
});

/* Optional schema-level indexes */
UserSchema.index({ status: 1, createdAt: -1 });
