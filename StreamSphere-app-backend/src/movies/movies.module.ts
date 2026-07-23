import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import {
  Movies,
  MovieSchema,
} from './schema/movies.schema';
import { MovieCategory, MovieCategorySchema } from '../movie-catagory/schema/movie-catagory.schema';
import { CloudFrontService } from '../common/cloudfront/cloudfront.service';
import { UploadedDocument, UploadedDocumentSchema } from '../common/file-upload/schemas/uploaded-documents.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movies.name, schema: MovieSchema },
      { name: MovieCategory.name, schema: MovieCategorySchema },
      { name: UploadedDocument.name, schema: UploadedDocumentSchema },
    ]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, CloudFrontService],
  exports: [MoviesService],
})
export class MoviesModule {}
