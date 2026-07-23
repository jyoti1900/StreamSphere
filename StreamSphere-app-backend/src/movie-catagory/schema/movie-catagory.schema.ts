import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UploadedDocument } from '../../common/file-upload/schemas/uploaded-documents.schema';

export type MovieCategoryDocument = MovieCategory & Document;

/* ---------- MAIN MOVIE CATEGORY SCHEMA ---------- */
@Schema({
  collection: 'movie_categories',
  timestamps: true,
  versionKey: false,
})
export class MovieCategory {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  name: string;

  @Prop({ type: Types.ObjectId, ref: UploadedDocument.name })
  image?: Types.ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const MovieCategorySchema =
  SchemaFactory.createForClass(MovieCategory);

/* ---------- OPTIONAL INDEXES (LIKE YOUR STYLE) ---------- */
MovieCategorySchema.index({ isDeleted: 1, createdAt: -1 });
