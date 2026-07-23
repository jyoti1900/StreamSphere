import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminDto {
  @ApiProperty({ example: 'admin@example.com', description: 'Admin email' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @ApiProperty({ example: 'AdminPass@123', description: 'Admin password' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(8)
  password!: string;
}
