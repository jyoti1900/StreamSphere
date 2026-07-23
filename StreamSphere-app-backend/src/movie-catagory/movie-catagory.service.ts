import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MovieCategory, MovieCategoryDocument } from './schema/movie-catagory.schema';
import { UploadedDocument, UploadedDocumentDocument } from '../common/file-upload/schemas/uploaded-documents.schema';
import { Model, Types } from 'mongoose';
import { CreateMovieCategoryDto, UpdateMovieCategoryDto } from './dto/movie-catagory.dto';
import { CloudFrontService } from '../common/cloudfront/cloudfront.service';
import { UploadStatus } from '../common/file-upload/enums/upload-status.enum';
import { escapeRegex } from '../common/utils/escape-regex';

@Injectable()
export class MovieCatagoryService {
    constructor(
        @InjectModel(MovieCategory.name)
        private readonly movieCatagoryModel: Model<MovieCategoryDocument>,
        @InjectModel(UploadedDocument.name)
        private readonly uploadedDocumentModel: Model<UploadedDocumentDocument>,
        private readonly cloudFrontService: CloudFrontService,
    ) {}

    private withSignedUrl(image: any): any {
        if (!image) return null;
        return {
            ...image,
            signedUrl: image.key ? this.cloudFrontService.getSignedStreamingUrl(image.key) : undefined,
        };
    }

    private async markUsed(id: Types.ObjectId | undefined, refId: Types.ObjectId) {
        if (!id) return;
        await this.uploadedDocumentModel.findByIdAndUpdate(id, {
            status: UploadStatus.USED,
            refType: MovieCategory.name,
            refId,
        });
    }

    private async markDeleted(id: Types.ObjectId | undefined) {
        if (!id) return;
        await this.uploadedDocumentModel.findByIdAndUpdate(id, { status: UploadStatus.DELETED });
    }

    private async validateImageDocument(imageId: string) {
        const doc = await this.uploadedDocumentModel.findById(imageId).lean();
        if (!doc) {
            throw new BadRequestException('Image document not found');
        }
        return doc._id as Types.ObjectId;
    }

    async create(data: CreateMovieCategoryDto) {
        const existingCategory = await this.movieCatagoryModel.findOne({
            name: { $regex: `^${escapeRegex(data.name)}$`, $options: 'i' },
            isDeleted: false,
        });

        if (existingCategory) {
            throw new ConflictException('Movie Catagory with this title already exists');
        }

        const createPayload: Record<string, unknown> = { ...data };

        if (data.image) {
            createPayload.image = await this.validateImageDocument(data.image);
        }

        const newCategory = await this.movieCatagoryModel.create(createPayload);
        await this.markUsed(newCategory.image as Types.ObjectId | undefined, newCategory._id as Types.ObjectId);

        const result = await this.movieCatagoryModel.findById(newCategory._id).populate('image').lean() as any;
        return { ...result, image: this.withSignedUrl(result?.image) };
    }

    async update(id: string, data: UpdateMovieCategoryDto) {
        const existing = await this.movieCatagoryModel.findOne({
            _id: id,
            isDeleted: false,
        }).lean();

        if (!existing) {
            throw new NotFoundException('Category not found');
        }

        if (data.name) {
            const duplicate = await this.movieCatagoryModel.findOne({
                name: { $regex: `^${escapeRegex(data.name)}$`, $options: 'i' },
                _id: { $ne: id },
                isDeleted: false,
            });

            if (duplicate) {
                throw new ConflictException('Category with this name already exists');
            }
        }

        const updatePayload: Record<string, unknown> = { ...data };
        const oldImage = existing.image as Types.ObjectId | undefined;

        if (data.image) {
            updatePayload.image = await this.validateImageDocument(data.image);
        }

        const result = await this.movieCatagoryModel
            .findByIdAndUpdate(id, updatePayload, { new: true })
            .populate('image')
            .lean() as any;

        if (!result) {
            throw new NotFoundException('Category not found');
        }

        if (data.image) {
            const newImageId = updatePayload.image as Types.ObjectId;
            if (oldImage && oldImage.toString() !== newImageId.toString()) {
                await this.markDeleted(oldImage);
            }
            await this.markUsed(newImageId, new Types.ObjectId(id));
        }

        return { ...result, image: this.withSignedUrl(result.image) };
    }

    async findall() {
        const categories = await this.movieCatagoryModel.find({ isDeleted: false }).lean();

        const validImageIds = categories
            .map(c => c.image)
            .filter((id): id is Types.ObjectId => !!id && Types.ObjectId.isValid(String(id)));

        const imageMap = new Map<string, any>();

        if (validImageIds.length > 0) {
            const images = await this.uploadedDocumentModel
                .find({ _id: { $in: validImageIds } })
                .lean();
            images.forEach(img => imageMap.set(img._id.toString(), img));
        }

        return categories.map(c => ({
            ...c,
            image: c.image && Types.ObjectId.isValid(String(c.image))
                ? this.withSignedUrl(imageMap.get(c.image.toString()) || null)
                : null,
        }));
    }

    async softDelete(id: string) {
        const category = await this.movieCatagoryModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true },
        );

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }
}
