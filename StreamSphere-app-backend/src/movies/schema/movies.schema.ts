import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MovieCategory } from '../../movie-catagory/schema/movie-catagory.schema';
import { UploadedDocument } from '../../common/file-upload/schemas/uploaded-documents.schema';

export type MoviesDocument = Movies & Document;

export enum MovieType {
  MOVIE = 'movie',
}

export enum MovieStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/* ----------------- CAST SUB SCHEMA ----------------- */

@Schema({ _id: false })
class Cast {
  @Prop({ required: true })
  name!: string;

  @Prop()
  role?: string;
}

const CastSchema = SchemaFactory.createForClass(Cast);

/* ----------------- MAIN MOVIE SCHEMA ----------------- */

@Schema({ timestamps: true })
export class Movies {
  /* -- RELATION -- */
  @Prop({ type: Types.ObjectId, ref: MovieCategory.name, required: true })
  category!: Types.ObjectId;

  /* -- BASIC INFO -- */
  @Prop({ required: true, trim: true, unique: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ enum: MovieType, required: true })
  type!: MovieType;

  @Prop({ enum: MovieStatus, default: MovieStatus.DRAFT })
  status!: MovieStatus;

  /* -- MEDIA -- */
  @Prop({type: Types.ObjectId, ref: UploadedDocument.name})
  thumnailimage?: Types.ObjectId;

  @Prop({type: Types.ObjectId, ref: UploadedDocument.name})
  posterimage?: Types.ObjectId;

  @Prop()
  video?: string;

  /** S3 object key used to generate CloudFront signed streaming URLs */
  @Prop()
  videoKey?: string;
  
  /* -- SERIES ONLY -- */
  @Prop()
  totalSeasons?: number;

  @Prop()
  totalEpisodes?: number;

  /* -- METADATA -- */
  @Prop({ required: true })
  releaseDate!: Date;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
duration!: number; // seconds

  
  @Prop()
  ageRating?: string;

  @Prop()
  audiolanguage?: string;

  @Prop([String])
  availableLanguages?: string[];

  @Prop([String])
  subtitles?: string[];

  /* -- CATEGORIZATION -- */
  @Prop([String])
  tags?: string[];

  @Prop()
  country?: string;

  /* -- CAST & CREW -- */
  @Prop([String])
  directors?: string[];

  @Prop({ type: [CastSchema] })
  cast?: Cast[];

  /* -- RELATIONS -- */
  @Prop({ type: [Types.ObjectId], ref: 'Movies' })
  relatedMovies?: Types.ObjectId[];

  /* -- SYSTEM -- */
  @Prop({ default: false })
  isDeleted!: boolean;
}

export const MovieSchema = SchemaFactory.createForClass(Movies);

/* ----------------- INDEXING ----------------- */

MovieSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
});