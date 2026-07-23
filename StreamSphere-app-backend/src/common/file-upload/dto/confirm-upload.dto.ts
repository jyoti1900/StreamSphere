import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsMongoId, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ConfirmUploadDto {
  @ApiProperty({
    description: 'Document ID to confirm',
    example: '67e0a9eb6f6f53cde74d9c11',
  })
  @IsMongoId()
  @IsNotEmpty()
  documentId!: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size!: number;
}
