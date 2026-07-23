import {
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {

    @ApiProperty({
        example: 'NewPassword@123',
        description: 'New account password',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, {
        message:
            'Password must be at least 8 characters long',
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
        message:
            'Password must contain uppercase, lowercase, number and special character',
    })
    password: string;
}