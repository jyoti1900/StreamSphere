import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { DocumentTypes } from '../enums/document-type.enum';

const MIME_TYPE_PATTERN = /^[a-z]+\/[a-z0-9.+-]+$/i;

export class PresignedPostDto {
    @ApiPropertyOptional({
        enum: DocumentTypes,
        default: DocumentTypes.MOVIES,
        description: 'Upload folder. Defaults to movies when omitted.',
    })
    @IsEnum(DocumentTypes)
    @IsOptional()
    folder: DocumentTypes = DocumentTypes.MOVIES;

    @ApiProperty({
        example: 'my-movie.mp4',
        description: 'Original file name to preserve extension in generated key.',
    })
    @IsString()
    @IsNotEmpty()
    filename!: string;

    @ApiProperty({
        example: 'video/mp4',
        description: 'MIME type of the file being uploaded.',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(MIME_TYPE_PATTERN, { message: 'Invalid MIME type format' })
    mimeType!: string;
}
