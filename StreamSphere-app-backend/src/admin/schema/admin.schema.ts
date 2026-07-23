import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type AdminDocument = Admin & Document;

export enum AdminStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({
  collection: 'admins',
  timestamps: true,
  versionKey: false,
})
export class Admin {
  @Prop({ required: true, trim: true })
  firstName!: string;

  @Prop({ required: true, trim: true })
  lastName!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

  @Prop({ required: true, select: false })
  password!: string;

  @Prop({
    enum: AdminStatus,
    default: AdminStatus.ACTIVE,
  })
  status!: AdminStatus;

  @Prop({ default: null })
  lastLoginAt?: Date;

  @Prop({ default: false })
  isDeleted!: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.pre<AdminDocument>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

AdminSchema.index({ status: 1, createdAt: -1 });
