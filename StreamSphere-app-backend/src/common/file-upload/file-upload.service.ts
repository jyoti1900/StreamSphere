import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import { S3Service } from './s3/s3.service';
import { UploadedDocument, UploadedDocumentDocument } from './schemas/uploaded-documents.schema';
import { UploadStatus } from './enums/upload-status.enum';
import { DocumentTypes } from './enums/document-type.enum';

@Injectable()
export class FileUploadService {
    private readonly logger = new Logger(FileUploadService.name);

    constructor(
        @InjectModel(UploadedDocument.name)
        private readonly uploadedDocModel: Model<UploadedDocumentDocument>,
        private readonly s3Service: S3Service
    ) {}

    async uploadToS3(file: Express.Multer.File, folder: DocumentTypes) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        const key = `${folder}/${randomUUID()}-${file.originalname}`;

        let doc;
        try {
            // upload to S3
            await this.s3Service.uploadFile(file.path, key, file.mimetype);

            // create DB entry
            doc = await this.uploadedDocModel.create({
                key,
                mime_type: file.mimetype,
                status: UploadStatus.UPLOADED,
                type: folder,
            });

            // generate presigned GET url
            const presignedUrl = await this.s3Service.generateGetPresignedUrl(key);

            return {
                documentId: doc._id,
                url: presignedUrl
            };
        } finally {
            // delete temp file
            try {
                await fs.unlink(file.path);
            } catch (error) {
                this.logger.error('Failed to delete temp file', error);
            }
        }
    }

    async confirmUpload(documentId: string, size: number) {
        const existing = await this.uploadedDocModel.findById(documentId);

        if (!existing) {
            throw new NotFoundException('Document not found');
        }

        if (
            existing.status !== UploadStatus.INITIATED &&
            existing.status !== UploadStatus.UPLOADED
        ) {
            throw new BadRequestException('Document cannot be confirmed in its current state');
        }

        const doc = await this.uploadedDocModel.findByIdAndUpdate(
            documentId,
            {
                status: UploadStatus.UPLOADED,
                size,
            },
            { new: true },
        );

        return doc;
    }

    async markAsUsed(documentId: string, refType: string, refId: string) {
        return this.uploadedDocModel.findByIdAndUpdate(
            documentId,
            {
                status: UploadStatus.USED,
                refType,
                refId
            },
            { new: true }
        );
    }

    /**
     * Generates a presigned POST URL so Next.js can upload a file (e.g. a movie)
     * directly to S3 without routing the binary through this server.
     *
     * Flow:
     *  1. Frontend calls POST /upload/presigned-post
     *  2. Backend returns { uploadUrl, fields, key, documentId }
     *  3. Frontend POSTs the file directly to S3 using uploadUrl + fields as form data
     *  4. After upload, frontend calls PATCH /movies/:id/video with { videoKey }
     */
    async generatePresignedPostUrl(folder: DocumentTypes, filename: string, mimeType: string) {
        const key = `${folder}/${randomUUID()}-${filename}`;

        const { url: uploadUrl, fields } = await this.s3Service.createPresignedPost(key, mimeType);

        const doc = await this.uploadedDocModel.create({
            key,
            mime_type: mimeType,
            status: UploadStatus.INITIATED,
            type: folder,
        });

        return {
            documentId: doc._id,
            uploadUrl,
            fields,
            key,
        };
    }
}
