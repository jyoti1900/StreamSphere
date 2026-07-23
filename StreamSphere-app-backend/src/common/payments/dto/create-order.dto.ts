import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Subscription plan id',
    example: 'monthly',
    enum: ['monthly', 'yearly'],
  })
  @IsString()
  @IsNotEmpty()
  planId!: string;
}
