import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WatchTime,
  WatchTimeSchema,
} from './schema/watchtime.schema';

import {
  Movies,
  MovieSchema,
} from '../movies/schema/movies.schema';
import { WatchtimeController } from './watchtime.controller';
import { WatchtimeService } from './watchtime.service';
import { CloudFrontService } from '../common/cloudfront/cloudfront.service';
import {
  UploadedDocument,
  UploadedDocumentSchema,
} from '../common/file-upload/schemas/uploaded-documents.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WatchTime.name,
        schema: WatchTimeSchema,
      },
      {
        name: Movies.name,
        schema: MovieSchema,
      },
      {
        name: UploadedDocument.name,
        schema: UploadedDocumentSchema,
      },
    ]),
  ],
  controllers: [WatchtimeController],
  providers: [WatchtimeService, CloudFrontService],
  exports: [WatchtimeService],
})
export class WatchtimeModule {}
