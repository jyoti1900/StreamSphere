import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ResetPasswordDto } from './reset-password.dto';

export class ResetPasswordWithTokenDto extends ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token from the email link',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
