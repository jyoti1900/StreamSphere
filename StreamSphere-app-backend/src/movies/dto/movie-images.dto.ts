import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateMovieImgaesDto {
  @ApiPropertyOptional({
    description: 'Thumbnail image document ID or uploaded file key',
    example: '65f1a3b2c5d8e9f0g1h2i3j4',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  thumnailimage?: string;  
  
  @ApiPropertyOptional({
    description: 'Poster image document ID or uploaded file key',
    example: '65f1a3b2c5d8e9f0g1h2i3j4',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  posterimage?: string;
}

export class UpdateMovieImgaesDto {
  @ApiPropertyOptional({
    description: 'Updated thumbnail image document ID or uploaded file key',
    example: '65f1a3b2c5d8e9f0g1h2i3j4',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  thumnailimage?: string;  
  
  @ApiPropertyOptional({
    description: 'Updated poster image document ID or uploaded file key',
    example: '65f1a3b2c5d8e9f0g1h2i3j4',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  posterimage?: string;
}