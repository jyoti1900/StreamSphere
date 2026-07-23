import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPaymentDto {
  @ApiProperty({
    description: 'Razorpay order id returned after checkout',
    example: 'order_NxYz123abc',
  })
  @IsString()
  @IsNotEmpty()
  razorpayOrderId!: string;

  @ApiProperty({
    description: 'Razorpay payment id returned after checkout',
    example: 'pay_NxYz123abc',
  })
  @IsString()
  @IsNotEmpty()
  razorpayPaymentId!: string;

  @ApiProperty({
    description: 'Razorpay payment signature returned after checkout',
    example: 'a1b2c3d4e5f6...',
  })
  @IsString()
  @IsNotEmpty()
  razorpaySignature!: string;
}
