import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactUsDto {
  @ApiProperty({
    example: 'Jyotipriya Das',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'jyotipriya@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Subscription Issue',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    example:
      'Unable to purchase premium subscription.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}