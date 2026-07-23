import { Module } from '@nestjs/common';
import { MovieCatagoryController } from './movie-catagory.controller';
import { MovieCatagoryService } from './movie-catagory.service';
import { MovieCategory, MovieCategorySchema } from './schema/movie-catagory.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadedDocument, UploadedDocumentSchema } from '../common/file-upload/schemas/uploaded-documents.schema';
import { CloudFrontService } from '../common/cloudfront/cloudfront.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: MovieCategory.name, schema: MovieCategorySchema },
            { name: UploadedDocument.name, schema: UploadedDocumentSchema },
        ]),
    ],
    controllers: [MovieCatagoryController],
    providers: [MovieCatagoryService, CloudFrontService],
    exports: [MongooseModule],
})
export class MovieCatagoryModule {}
