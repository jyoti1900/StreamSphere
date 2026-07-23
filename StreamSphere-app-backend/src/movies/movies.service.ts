import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movies, MoviesDocument } from './schema/movies.schema';

import { CreateMovieDto } from './dto/create-movies.dto';
import { UpdateMoviesDto } from './dto/update-movies.dto';
import { CreateMovieImgaesDto, UpdateMovieImgaesDto } from './dto/movie-images.dto';
import { MovieCategory, MovieCategoryDocument } from '../movie-catagory/schema/movie-catagory.schema';
import { CloudFrontService } from '../common/cloudfront/cloudfront.service';
import { UploadedDocument, UploadedDocumentDocument } from '../common/file-upload/schemas/uploaded-documents.schema';
import { UploadStatus } from '../common/file-upload/enums/upload-status.enum';
import { escapeRegex } from '../common/utils/escape-regex';

@Injectable()
export class MoviesService {
    constructor(
        @InjectModel(Movies.name)
        private readonly moviesModel: Model<MoviesDocument>,

        @InjectModel(MovieCategory.name)
        private readonly categoryModel: Model<MovieCategoryDocument>,

        @InjectModel(UploadedDocument.name)
        private readonly uploadedDocModel: Model<UploadedDocumentDocument>,

        private readonly cloudFrontService: CloudFrontService,
    ) { }

    private withSignedUrl(image: any): any {
        if (!image) return null;
        return {
            ...image,
            signedUrl: image.key ? this.cloudFrontService.getSignedStreamingUrl(image.key) : undefined,
        };
    }

    private async markUsed(id: Types.ObjectId | undefined, refType: string, refId: Types.ObjectId) {
        if (!id) return;
        await this.uploadedDocModel.findByIdAndUpdate(id, {
            status: UploadStatus.USED,
            refType,
            refId,
        });
    }

    private async markDeleted(id: Types.ObjectId | undefined) {
        if (!id) return;
        await this.uploadedDocModel.findByIdAndUpdate(id, { status: UploadStatus.DELETED });
    }

    private async resolveUploadedDocumentReference(value: string, fieldName: string) {
        if (Types.ObjectId.isValid(value)) {
            const doc = await this.uploadedDocModel.findById(value).lean();
            if (!doc) {
                throw new BadRequestException(`${fieldName} document not found`);
            }
            return doc._id as Types.ObjectId;
        }

        const doc = await this.uploadedDocModel.findOne({ key: value }).lean();
        if (doc) {
            return doc._id as Types.ObjectId;
        }

        throw new BadRequestException(
            `${fieldName} must be a valid MongoDB ObjectId or uploaded document key`,
        );
    }

    private async findActiveMovie(id: string) {
        const movie = await this.moviesModel.findOne({ _id: id, isDeleted: false });
        if (!movie) {
            throw new NotFoundException('Movie not found');
        }
        return movie;
    }

    private async validateCategory(categoryId: string) {
        const category = await this.categoryModel.findOne({
            _id: categoryId,
            isDeleted: false,
        });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async create(data: CreateMovieDto) {
        await this.validateCategory(data.category);

        const existingMovie = await this.moviesModel.findOne({
            title: { $regex: `^${escapeRegex(data.title)}$`, $options: 'i' },
            isDeleted: false,
        });

        if (existingMovie) {
            throw new ConflictException('Movie with this title already exists');
        }

        const createPayload: Record<string, unknown> = {
            ...data,
            category: new Types.ObjectId(data.category),
        };

        if (data.thumnailimage) {
            createPayload.thumnailimage = await this.resolveUploadedDocumentReference(
                data.thumnailimage,
                'thumnailimage',
            );
        }

        if (data.posterimage) {
            createPayload.posterimage = await this.resolveUploadedDocumentReference(
                data.posterimage,
                'posterimage',
            );
        }

        if (data.relatedMovies?.length) {
            createPayload.relatedMovies = data.relatedMovies.map(
                (id) => new Types.ObjectId(id),
            );
        }

        const newMovie = await this.moviesModel.create(createPayload);

        await Promise.all([
            this.markUsed(newMovie.thumnailimage, Movies.name, newMovie._id as Types.ObjectId),
            this.markUsed(newMovie.posterimage, Movies.name, newMovie._id as Types.ObjectId),
        ]);

        return newMovie;
    }

    async list(categoryId: string) {
        await this.validateCategory(categoryId);

        const movies = await this.moviesModel
            .find({
                category: new Types.ObjectId(categoryId),
                isDeleted: false,
            })
            .lean();

        if (!movies.length) {
            return [];
        }

        const validImageIds = movies
            .map(m => [m.thumnailimage, m.posterimage])
            .flat()
            .filter((id): id is Types.ObjectId => !!id && Types.ObjectId.isValid(String(id)));

        const imageMap = new Map<string, any>();

        if (validImageIds.length > 0) {
            const images = await this.uploadedDocModel
                .find({ _id: { $in: validImageIds } })
                .lean();

            images.forEach(img => imageMap.set(img._id.toString(), img));
        }

        return movies.map(movie => ({
            ...movie,
            thumnailimage: movie.thumnailimage && Types.ObjectId.isValid(String(movie.thumnailimage))
                ? this.withSignedUrl(imageMap.get(movie.thumnailimage.toString()) || null)
                : null,
            posterimage: movie.posterimage && Types.ObjectId.isValid(String(movie.posterimage))
                ? this.withSignedUrl(imageMap.get(movie.posterimage.toString()) || null)
                : null,
        }));
    }

    async update(itemId: string, data: UpdateMoviesDto) {
        if (data.title) {
            const existingMovie = await this.moviesModel.findOne({
                title: { $regex: `^${escapeRegex(data.title)}$`, $options: 'i' },
                _id: { $ne: itemId },
                isDeleted: false,
            });

            if (existingMovie) {
                throw new ConflictException('Movie with this name already exists');
            }
        }

        const existing = await this.moviesModel.findOne({
            _id: itemId,
            isDeleted: false,
        }).lean();

        if (!existing) {
            throw new NotFoundException('Movie not found');
        }

        if (data.category) {
            await this.validateCategory(data.category);
        }

        const updatePayload: Record<string, unknown> = { ...data };

        if (data.category) {
            updatePayload.category = new Types.ObjectId(data.category);
        }

        if (data.thumnailimage) {
            updatePayload.thumnailimage = await this.resolveUploadedDocumentReference(
                data.thumnailimage,
                'thumnailimage',
            );
        }

        if (data.posterimage) {
            updatePayload.posterimage = await this.resolveUploadedDocumentReference(
                data.posterimage,
                'posterimage',
            );
        }

        if (data.relatedMovies?.length) {
            updatePayload.relatedMovies = data.relatedMovies.map(
                (id) => new Types.ObjectId(id),
            );
        }

        const oldThumb = existing.thumnailimage as Types.ObjectId | undefined;
        const oldPoster = existing.posterimage as Types.ObjectId | undefined;

        const result = await this.moviesModel
            .findByIdAndUpdate(itemId, updatePayload, { new: true })
            .populate('thumnailimage')
            .populate('posterimage')
            .lean() as any;

        if (updatePayload.thumnailimage) {
            const newThumb = updatePayload.thumnailimage as Types.ObjectId;

            if (oldThumb && oldThumb.toString() !== newThumb.toString()) {
                await this.markDeleted(oldThumb);
            }

            await this.markUsed(newThumb, Movies.name, result._id as Types.ObjectId);
        }

        if (updatePayload.posterimage) {
            const newPoster = updatePayload.posterimage as Types.ObjectId;

            if (oldPoster && oldPoster.toString() !== newPoster.toString()) {
                await this.markDeleted(oldPoster);
            }

            await this.markUsed(newPoster, Movies.name, result._id as Types.ObjectId);
        }

        return {
            ...result,
            thumnailimage: result.thumnailimage
                ? this.withSignedUrl(result.thumnailimage)
                : null,
            posterimage: result.posterimage
                ? this.withSignedUrl(result.posterimage)
                : null,
        };
    }

    async softDelete(itemId: string) {
        const movie = await this.moviesModel.findOneAndUpdate(
            { _id: itemId, isDeleted: false },
            { isDeleted: true },
            { new: true },
        );

        if (!movie) {
            throw new NotFoundException('Movie not found');
        }

        return movie;
    }

    async listGroupedByCategory() {
        const categories = await this.categoryModel.find({ isDeleted: false }).lean();

        if (!categories.length) {
            return [];
        }

        const movies = await this.moviesModel.find({ isDeleted: false }).lean();

        const validImageIds = movies
            .map(m => [m.thumnailimage, m.posterimage])
            .flat()
            .filter((id): id is Types.ObjectId => !!id && Types.ObjectId.isValid(String(id)));

        const imageMap = new Map<string, any>();

        if (validImageIds.length > 0) {
            const images = await this.uploadedDocModel
                .find({ _id: { $in: validImageIds } })
                .lean();

            images.forEach(img => imageMap.set(img._id.toString(), img));
        }

        const withSignedUrl = (image: any) => {
            if (!image) return null;
            return {
                ...image,
                signedUrl: image.key
                    ? this.cloudFrontService.getSignedStreamingUrl(image.key)
                    : undefined,
            };
        };

        const movieMap = new Map<string, any[]>();

        for (const movie of movies) {
            const key = movie.category.toString();

            const transformedMovie = {
                ...movie,
                thumnailimage:
                    movie.thumnailimage && Types.ObjectId.isValid(String(movie.thumnailimage))
                        ? withSignedUrl(imageMap.get(movie.thumnailimage.toString()))
                        : null,
                posterimage:
                    movie.posterimage && Types.ObjectId.isValid(String(movie.posterimage))
                        ? withSignedUrl(imageMap.get(movie.posterimage.toString()))
                        : null,
            };

            if (!movieMap.has(key)) {
                movieMap.set(key, []);
            }

            movieMap.get(key)!.push(transformedMovie);
        }

        return categories.map(cat => ({
            _id: cat._id,
            category: cat.name,
            movies: movieMap.get(cat._id.toString()) || [],
        }));
    }

    async addImages(_id: string, dto: CreateMovieImgaesDto) {
        const movie = await this.findActiveMovie(_id);

        if (!dto.thumnailimage && !dto.posterimage) {
            throw new BadRequestException('At least one of thumnailimage or posterimage is required');
        }

        if (dto.thumnailimage) {
            movie.thumnailimage = await this.resolveUploadedDocumentReference(
                dto.thumnailimage,
                'thumnailimage',
            );
        }

        if (dto.posterimage) {
            movie.posterimage = await this.resolveUploadedDocumentReference(
                dto.posterimage,
                'posterimage',
            );
        }

        const saved = await movie.save();

        await Promise.all([
            dto.thumnailimage
                ? this.markUsed(saved.thumnailimage, Movies.name, saved._id as Types.ObjectId)
                : Promise.resolve(),
            dto.posterimage
                ? this.markUsed(saved.posterimage, Movies.name, saved._id as Types.ObjectId)
                : Promise.resolve(),
        ]);

        return saved;
    }

    async updateImages(_id: string, dto: UpdateMovieImgaesDto) {
        const movie = await this.findActiveMovie(_id);

        const oldThumb = movie.thumnailimage;
        const oldPoster = movie.posterimage;

        if (dto.thumnailimage !== undefined) {
            movie.thumnailimage = await this.resolveUploadedDocumentReference(
                dto.thumnailimage,
                'thumnailimage',
            );
        }

        if (dto.posterimage !== undefined) {
            movie.posterimage = await this.resolveUploadedDocumentReference(
                dto.posterimage,
                'posterimage',
            );
        }

        const saved = await movie.save();

        if (dto.thumnailimage !== undefined && saved.thumnailimage) {
            const newThumb = saved.thumnailimage as Types.ObjectId;
            if (oldThumb && oldThumb.toString() !== newThumb.toString()) {
                await this.markDeleted(oldThumb);
            }
            await this.markUsed(newThumb, Movies.name, saved._id as Types.ObjectId);
        }

        if (dto.posterimage !== undefined && saved.posterimage) {
            const newPoster = saved.posterimage as Types.ObjectId;
            if (oldPoster && oldPoster.toString() !== newPoster.toString()) {
                await this.markDeleted(oldPoster);
            }
            await this.markUsed(newPoster, Movies.name, saved._id as Types.ObjectId);
        }

        return saved;
    }

    async saveVideoKey(_id: string, videoKey: string, duration: number) {
        await this.findActiveMovie(_id);

        const movie = await this.moviesModel.findByIdAndUpdate(
            _id,
            { videoKey, duration },
            { new: true, runValidators: true },
        );

        if (!movie) {
            throw new NotFoundException('Movie not found');
        }

        const doc = await this.uploadedDocModel.findOne({ key: videoKey }).lean();
        if (doc) {
            await this.markUsed(doc._id as Types.ObjectId, Movies.name, movie._id as Types.ObjectId);
        }

        return movie;
    }

    async getStreamingUrl(_id: string) {
        const movie = await this.moviesModel.findOne({ _id, isDeleted: false });

        if (!movie) {
            throw new NotFoundException('Movie not found');
        }

        if (!movie.videoKey) {
            throw new NotFoundException('No video has been uploaded for this movie yet');
        }

        const streamingUrl = this.cloudFrontService.getSignedStreamingUrl(movie.videoKey);

        return { streamingUrl };
    }
}
