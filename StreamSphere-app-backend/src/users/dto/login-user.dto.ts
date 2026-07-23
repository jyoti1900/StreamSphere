import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({
        description: 'User email address',
        example: 'john@example.com',
        type: String,
        format: 'email',
    })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({
        description: 'User password (minimum 8 characters)',
        example: 'SecurePassword123',
        type: String,
        minLength: 8,
    })
    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    @MinLength(8)
    password: string;
}
