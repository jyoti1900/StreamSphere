import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentTypes } from '../enums/document-type.enum';

export class UploadFileDto {
    @ApiProperty({
        description: 'Document type classification',
        enum: ['movies', 'categories', 'other'],
        example: 'movies',
    })
    @IsEnum(DocumentTypes)
    @IsNotEmpty()
    documentType!: DocumentTypes;
}
