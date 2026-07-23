import { Logger, Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { S3Service } from './s3/s3.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadedDocument, UploadedDocumentSchema } from './schemas/uploaded-documents.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: UploadedDocument.name, schema: UploadedDocumentSchema },
      ]),
    ],
  controllers: [FileUploadController],
  providers: [FileUploadService, S3Service]
})
export class FileUploadModule {}
