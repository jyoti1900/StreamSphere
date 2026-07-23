import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import {
  Model,
  Types,
} from 'mongoose';

import {
  WatchTime,
  WatchTimeDocument,
} from './schema/watchtime.schema';

import {
  Movies,
  MoviesDocument,
} from '../movies/schema/movies.schema';

import { UpdateWatchTimeDto } from './dto/update-watchtime.dto';
import { CloudFrontService } from '../common/cloudfront/cloudfront.service';
import {
  UploadedDocument,
  UploadedDocumentDocument,
} from '../common/file-upload/schemas/uploaded-documents.schema';

@Injectable()
export class WatchtimeService {
  constructor(
    @InjectModel(WatchTime.name)
    private readonly watchtimeModel: Model<WatchTimeDocument>,

    @InjectModel(Movies.name)
    private readonly moviesModel: Model<MoviesDocument>,

    @InjectModel(UploadedDocument.name)
    private readonly uploadedDocModel: Model<UploadedDocumentDocument>,

    private readonly cloudFrontService: CloudFrontService,
  ) { }

  private toObjectId(
    value: string | undefined,
    fieldName: string,
  ): Types.ObjectId | null {
    if (!value || !Types.ObjectId.isValid(value)) {
      return null;
    }

    return new Types.ObjectId(value);
  }

  private withSignedUrl(image: any): any {
    if (!image) {
      return null;
    }

    const normalizedImage =
      typeof image?.toObject === 'function'
        ? image.toObject()
        : image;

    return {
      ...normalizedImage,
      signedUrl: normalizedImage.key
        ? this.cloudFrontService.getSignedStreamingUrl(normalizedImage.key)
        : undefined,
    };
  }

  private getProgressData(watchTime: number, duration: number) {
    const safeWatchTime = Number(watchTime) || 0;
    const safeDuration = Number(duration) || 0;
    const progressPercentage =
      safeDuration > 0
        ? Math.min(Math.round((safeWatchTime / safeDuration) * 100), 100)
        : 0;
    const remainingTime = Math.max(safeDuration - safeWatchTime, 0);
    const completed = progressPercentage >= 95 || safeWatchTime >= safeDuration;
    const status = completed
      ? 'completed'
      : safeWatchTime > 0
        ? 'in-progress'
        : 'not-started';

    return {
      progressPercentage,
      remainingTime,
      completed,
      status,
    };
  }

  private buildContinueWatchingResponse(history: any[] = [], inProgress: any[] = []) {
    return {
      history: Array.isArray(history) ? history : [],
      inProgress: Array.isArray(inProgress) ? inProgress : [],
      watchedMoviesCount: Array.isArray(history) ? history.length : 0,
      inProgressMoviesCount: Array.isArray(inProgress) ? inProgress.length : 0,
    };
  }

  private async enrichMovieWithMedia(movie: any) {
    if (!movie) {
      return null;
    }

    const imageReferences = [movie.thumnailimage, movie.posterimage]
      .filter(Boolean)
      .map((image) => {
        if (typeof image === 'object' && image !== null && '_id' in image) {
          return image._id as Types.ObjectId;
        }

        return image as Types.ObjectId;
      })
      .filter((image): image is Types.ObjectId => Boolean(image));

    const imageMap = new Map<string, any>();

    if (imageReferences.length > 0) {
      const images = await this.uploadedDocModel
        .find({ _id: { $in: imageReferences } })
        .lean();

      images.forEach((image) => {
        imageMap.set(image._id.toString(), image);
      });
    }

    return {
      ...movie,
      thumnailimage: movie.thumnailimage
        ? this.withSignedUrl(
            imageMap.get(
              (movie.thumnailimage._id || movie.thumnailimage).toString(),
            ) || movie.thumnailimage,
          )
        : null,
      posterimage: movie.posterimage
        ? this.withSignedUrl(
            imageMap.get(
              (movie.posterimage._id || movie.posterimage).toString(),
            ) || movie.posterimage,
          )
        : null,
    };
  }

  /* =========================================================
      UPDATE CONTINUE WATCHING
  ========================================================= */

  async updateWatchTime(
    userId: string,
    payload: UpdateWatchTimeDto,
  ) {
    const userObjectId = this.toObjectId(
      userId,
      'userId',
    );
    const movieObjectId = this.toObjectId(
      payload.movieId,
      'movieId',
    );

    if (!userObjectId || !movieObjectId) {
      throw new BadRequestException(
        'Invalid userId or movieId',
      );
    }

    const movie = await this.moviesModel.findOne({
      _id: movieObjectId,
      isDeleted: false,
    }).lean();

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const cappedWatchTime = movie.duration
      ? Math.min(payload.watchTime, movie.duration)
      : payload.watchTime;

    const watchRecord = await this.watchtimeModel.findOneAndUpdate(
      {
        user: userObjectId,
        movie: movieObjectId,
      },
      {
        $set: {
          watchTime: cappedWatchTime,
          lastWatchedAt: new Date(),
          isDeleted: false,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    )
      .populate({
        path: 'movie',
        populate: [
          { path: 'category' },
          { path: 'thumnailimage' },
          { path: 'posterimage' },
        ],
      })
      .lean();

    const enrichedMovie = await this.enrichMovieWithMedia(watchRecord.movie);
    const progressData = this.getProgressData(
      cappedWatchTime,
      movie.duration,
    );

    return {
      ...(watchRecord as any),
      movie: enrichedMovie,
      ...progressData,
    };
  }

  /* =========================================================
      GET CONTINUE WATCHING
  ========================================================= */

  async getContinueWatching(userId: string) {
    // This Typecasting is not required Here. It will be in the middleware.
    const userObjectId = this.toObjectId(
      userId,
      'userId',
    );

    if (!userObjectId) {
      throw new BadRequestException('Invalid userId');
    }

    const watchRecords = await this.watchtimeModel
      .find({ user: userObjectId, isDeleted: false })
      .populate({
        path: 'movie',
        match: { isDeleted: false },
        populate: [
          { path: 'category', select: ['name'] },
          { path: 'thumnailimage', select: ['key'] },
          { path: 'posterimage' },
        ],
      })
      .sort({ lastWatchedAt: -1 })
      .lean();

    const history: any[] = [];
    const inProgress: any[] = [];

    for (const record of watchRecords) {
      const movie = record.movie as any;
      if (!movie) {
        continue;
      }
      const progressData = this.getProgressData(
        record.watchTime,
        movie?.duration,
      );
      const item = {
        ...record,
        movie: await this.enrichMovieWithMedia(movie),
        ...progressData,
      };

      if (item.completed) {
        history.push(item);
      } else if (item.watchTime > 0) {
        inProgress.push(item);
      }
    }

    return this.buildContinueWatchingResponse(history, inProgress);
  }

  /* =========================================================
      REMOVE MOVIE FROM CONTINUE WATCHING
  ========================================================= */

  async removeMovie(
    userId: string,
    movieId: string,
  ) {
    const userObjectId = this.toObjectId(
      userId,
      'userId',
    );
    const movieObjectId = this.toObjectId(
      movieId,
      'movieId',
    );

    if (!userObjectId || !movieObjectId) {
      throw new BadRequestException(
        'Invalid userId or movieId',
      );
    }

    const result = await this.watchtimeModel.updateOne(
      {
        user: userObjectId,
        movie: movieObjectId,
        isDeleted: false,
      },
      { $set: { isDeleted: true } },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException(
        'Watch record not found',
      );
    }

    return {
      message:
        'Movie removed from continue watching',
    };
  }
}