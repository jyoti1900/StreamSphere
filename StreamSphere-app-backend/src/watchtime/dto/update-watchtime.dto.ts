import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateWatchTimeDto {
  @ApiPropertyOptional({
    description:
      'JWT access token from login (optional if sent via Authorization header)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsOptional()
  @IsString()
  accessToken?: string;

  @ApiProperty({
    description: 'Movie ID',
    example: '6865c7b8c2f0b2f4a7f6c113',
  })
  @IsMongoId()
  movieId!: string;

  @ApiProperty({
    description: 'Watch progress in seconds',
    example: 120,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  watchTime!: number;
}