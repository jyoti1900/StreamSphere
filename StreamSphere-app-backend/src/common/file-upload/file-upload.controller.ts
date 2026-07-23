import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './middleware/file-upload.middleware';
import { FileUploadService } from './file-upload.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { PresignedPostDto } from './dto/presigned-post.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.dto';
import { DocumentTypes } from './enums/document-type.enum';
import { AdminOnly } from '../../auth/decorators/admin-only.decorator';

@ApiTags('File Upload')
@Controller('upload')
export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) {}

    @AdminOnly()
    @Post()
    @ApiBearerAuth('access-token')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        summary: 'Upload file to S3',
        description: 'Uploads a file to AWS S3 storage with document type classification',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File to upload',
                },
                documentType: {
                    type: 'string',
                    enum: ['movies', 'categories', 'other'],
                    description: 'Document type classification',
                    example: 'movies',
                },
            },
            required: ['file', 'documentType'],
        },
    })
    @ApiResponse({
        status: 201,
        description: 'File successfully uploaded to S3',
        schema: {
            example: {
                documentId: 'doc-12345-67890',
                fileName: 'movie-poster.jpg',
                documentType: 'movies',
                uploadStatus: 'initiated',
                uploadedAt: '2024-03-21T10:30:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid file or document type',
    })
    async uploadToS3(@UploadedFile() file: Express.Multer.File, @Body() dto: UploadFileDto) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        return this.fileUploadService.uploadToS3(file, dto.documentType);
    }

    @AdminOnly()
    @Post('confirm')
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Confirm file upload',
        description: 'Confirms a file upload and marks it as completed',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                documentId: {
                    type: 'string',
                    description: 'Document ID to confirm',
                    example: 'doc-12345-67890',
                },
                size: {
                    type: 'number',
                    description: 'File size in bytes',
                    example: 1024000,
                },
            },
            required: ['documentId', 'size'],
        },
    })
    @ApiBody({ type: ConfirmUploadDto })
    @ApiResponse({
        status: 200,
        description: 'Upload confirmed successfully',
        schema: {
            example: {
                documentId: 'doc-12345-67890',
                uploadStatus: 'completed',
                size: 1024000,
                confirmedAt: '2024-03-21T10:35:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Document not found',
    })
    async confirmUpload(@Body() body: ConfirmUploadDto) {
        return this.fileUploadService.confirmUpload(body.documentId, body.size);
    }

    /**
     * Returns a presigned POST URL that the Next.js frontend can use to upload
     * a file (e.g. a video) directly to S3 — no binary passes through this server.
     *
     * POST /upload/presigned-post
     * Body: { filename: 'my-movie.mp4', mimeType: 'video/mp4' }
     * Response: { documentId, uploadUrl, fields, key }
     */
    @AdminOnly()
    @Post('presigned-post')
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Generate presigned POST URL',
        description: 'Generates an S3 presigned POST payload for direct client-side upload. Folder defaults to movies.',
    })
    @ApiBody({
        type: PresignedPostDto,
        description: 'Presigned POST request payload',
    })
    @ApiResponse({
        status: 201,
        description: 'Presigned POST payload generated successfully',
        schema: {
            example: {
                documentId: '67e0a9eb6f6f53cde74d9c11',
                uploadUrl: 'https://bucket-name.s3.amazonaws.com',
                fields: {
                    key: 'movies/3f94179d-9f72-4d4a-b8f8-7e26d4731b8d-my-movie.mp4',
                    'Content-Type': 'video/mp4',
                    policy: 'eyJleHBpcmF0aW9uIjoi...',
                    'x-amz-algorithm': 'AWS4-HMAC-SHA256',
                    'x-amz-credential': 'AKIA.../20260324/us-east-1/s3/aws4_request',
                    'x-amz-date': '20260324T120000Z',
                    'x-amz-signature': 'b3f3...'
                },
                key: 'movies/3f94179d-9f72-4d4a-b8f8-7e26d4731b8d-my-movie.mp4'
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid request payload',
    })
    async getPresignedPostUrl(@Body() dto: PresignedPostDto) {
        return this.fileUploadService.generatePresignedPostUrl(
            dto.folder ?? DocumentTypes.MOVIES,
            dto.filename,
            dto.mimeType
        );
    }
}
