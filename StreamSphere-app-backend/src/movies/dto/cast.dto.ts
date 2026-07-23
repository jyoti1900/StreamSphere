import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CastDto {
  @ApiProperty({
    description: 'Actor name',
    example: 'Keanu Reeves',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Character/role name',
    example: 'Neo',
    type: String,
  })
  @IsOptional()
  @IsString()
  role?: string;
}
