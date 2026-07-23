import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    S3Client,
    DeleteObjectCommand,
    PutObjectCommand,
    GetObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createPresignedPost, PresignedPost } from '@aws-sdk/s3-presigned-post';
import * as fs from 'fs';

@Injectable()
export class S3Service {
    private readonly s3: S3Client;
    private readonly bucket: string;

    constructor(private readonly configService: ConfigService) {
        const awsConfig = this.configService.get('aws');
        this.bucket = awsConfig.s3BucketFolder;

        const accessKeyId = awsConfig.accessKeyId;
        const secretAccessKey = awsConfig.secretAccessKey;
        console.log('Initializing S3Service with config:', {
            region: awsConfig.region,
            accessKeyId: !!accessKeyId,
            secretAccessKey: !!secretAccessKey
        });
        const s3Config: any = {
            region: awsConfig.region || 'us-east-1' // default region if not set
        };

        if (accessKeyId && secretAccessKey) {
            s3Config.credentials = {
                accessKeyId,
                secretAccessKey
            };
        }

        this.s3 = new S3Client(s3Config);
    }

    async uploadFile(filePath: string, key: string, mimeType: string) {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const fileStream = fs.createReadStream(filePath);
        console.log('Uploading file to S3 with key:', key);

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: fileStream,
            ContentType: mimeType
        });

        try {
            await this.s3.send(command);
        } catch (error) {
            console.error('Error uploading to S3:', error);
            throw error;
        } finally {
            fileStream.destroy();
        }
    }

    async generateGetPresignedUrl(key: string) {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        return getSignedUrl(this.s3, command, { expiresIn: 3600 });
    }

    /**
     * Generates a presigned POST URL so the client can upload directly to S3.
     * @param key        Full S3 object key for the upload
     * @param mimeType   Expected MIME type of the file (e.g. "video/mp4")
     * @param maxSizeMB  Maximum allowed file size in MB (default 5 GB)
     */
    async createPresignedPost(key: string, mimeType: string, maxSizeMB = 5120): Promise<PresignedPost> {
        return createPresignedPost(this.s3, {
            Bucket: this.bucket,
            Key: key,
            Conditions: [
                ['content-length-range', 0, maxSizeMB * 1024 * 1024],
                ['starts-with', '$Content-Type', mimeType.split('/')[0]],
            ],
            Fields: {
                'Content-Type': mimeType,
            },
            Expires: 3600,
        });
    }

    async delete(key: string) {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key
            });

            return await this.s3.send(command);
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete file');
        }
    }
}
