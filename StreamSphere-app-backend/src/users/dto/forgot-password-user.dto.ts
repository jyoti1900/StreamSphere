import {
    IsEmail,
    IsNotEmpty,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {

    @ApiProperty({
        example: 'john@example.com',
        description: 'Registered user email address',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}