import { IsString, IsOptional, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieCategoryDto {
    
    @ApiProperty({
        description: 'Category name',
        example: 'Action & Adventure',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: 'Uploaded document ID for category image',
        example: '65f1a3b2c5d8e9f0g1h2i3j4',
        type: String,
    })
    @IsOptional()
    @IsMongoId()
    image?: string;
    
}

export class UpdateMovieCategoryDto {
    @ApiPropertyOptional({
        description: 'Updated category name',
        example: 'Action',
        type: String,
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @ApiPropertyOptional({
        description: 'Uploaded document ID for category image',
        example: '65f1a3b2c5d8e9f0g1h2i3j4',
        type: String,
    })
    @IsOptional()
    @IsMongoId()
    image?: string;
}