import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { User } from '../../users/schema/users.schema';
import { Movies } from '../../movies/schema/movies.schema';

export type WatchTimeDocument = WatchTime & Document;

@Schema({
  collection: 'watchtimes',
  timestamps: true,
  versionKey: false,
})
export class WatchTime {
  /* USER REFERENCE */
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user!: Types.ObjectId;

  /* MOVIE REFERENCE */
  @Prop({
    type: Types.ObjectId,
    ref: Movies.name,
    required: true,
  })
  movie!: Types.ObjectId;

  /* CURRENT WATCH POSITION (SECONDS) */
  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  watchTime!: number;

  /* LAST WATCHED TIMESTAMP */
  @Prop({
    type: Date,
    default: Date.now,
  })
  lastWatchedAt!: Date;

  @Prop({ default: false })
  isDeleted!: boolean;
}

export const WatchTimeSchema =
  SchemaFactory.createForClass(WatchTime);

/* ----------------- INDEXES ----------------- */

/* ENSURE ONE RECORD PER USER-MOVIE PAIR */
WatchTimeSchema.index(
  { user: 1, movie: 1 },
  { unique: true },
);

/* USER LIBRARY QUERIES */
WatchTimeSchema.index({
  user: 1,
  lastWatchedAt: -1,
});

/* MOVIE ANALYTICS */
WatchTimeSchema.index({
  movie: 1,
});