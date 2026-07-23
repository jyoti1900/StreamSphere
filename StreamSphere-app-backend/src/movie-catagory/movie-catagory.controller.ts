import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Put,
    Param,
    Get,
    Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { MovieCatagoryService } from './movie-catagory.service';
import { CreateMovieCategoryDto, UpdateMovieCategoryDto } from './dto/movie-catagory.dto';
import { Public } from '../auth/decorators/public.decorator';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@ApiTags('Movie Categories')
@Controller('movie-catagory')
export class MovieCatagoryController {
    constructor(private readonly movieCatagoryService: MovieCatagoryService) { }

    @AdminOnly()
    @Post('create')
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new movie category',
        description: 'Creates a new movie category with optional image upload',
    })
    @ApiBody({
        type: CreateMovieCategoryDto,
        description: 'Category creation data',
    })
    @ApiResponse({
        status: 201,
        description: 'Category successfully created',
        schema: {
            example: {
                _id: '65f1a3b2c5d8e9f0g1h2i3j3',
                name: 'Action & Adventure',
                image: 'category-action-12345.jpg',
                createdAt: '2024-03-21T10:30:00.000Z',
                updatedAt: '2024-03-21T10:30:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Validation failed',
    })
    async createUser(@Body() payload: CreateMovieCategoryDto) {
        return this.movieCatagoryService.create(payload);
    }

    @AdminOnly()
    @Put('update/:id')
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Update a movie category',
        description: 'Updates category details and optionally uploads a new image',
    })
    @ApiParam({
        name: 'id',
        description: 'Category ID (MongoDB ObjectId)',
        example: '65f1a3b2c5d8e9f0g1h2i3j3',
    })
    @ApiBody({
        type: UpdateMovieCategoryDto,
        description: 'Category update data',
    })
    @ApiResponse({
        status: 200,
        description: 'Category successfully updated',
        schema: {
            example: {
                _id: '65f1a3b2c5d8e9f0g1h2i3j3',
                name: 'Action',
                image: 'category-action-updated-12345.jpg',
                updatedAt: '2024-03-21T11:00:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Category not found',
    })
    async updateUser(
        @Param('id', ParseMongoIdPipe) id: string,
        @Body() payload: UpdateMovieCategoryDto,
    ) {
        return this.movieCatagoryService.update(id, payload);
    }

    @Public()
    @Get('list')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get all movie categories',
        description: 'Retrieves all movie categories with full image URLs',
    })
    @ApiResponse({
        status: 200,
        description: 'List of all categories',
        schema: {
            example: {
                categories: [
                    {
                        _id: '65f1a3b2c5d8e9f0g1h2i3j3',
                        name: 'Action & Adventure',
                        image: 'http://localhost:3000/uploads/images/category-action-12345.jpg',
                        createdAt: '2024-03-21T10:30:00.000Z',
                    },
                    {
                        _id: '65f1a3b2c5d8e9f0g1h2i3j4',
                        name: 'Drama',
                        image: 'http://localhost:3000/uploads/images/category-drama-12345.jpg',
                        createdAt: '2024-03-21T10:35:00.000Z',
                    },
                ],
            },
        },
    })
    async getAllCategories() {
        return this.movieCatagoryService.findall();
    }

    @AdminOnly()
    @Delete('delete/:id')
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Delete a movie category',
        description: 'Soft deletes a category. Requires admin access token.',
    })
    @ApiParam({
        name: 'id',
        description: 'Category ID (MongoDB ObjectId)',
        example: '65f1a3b2c5d8e9f0g1h2i3j3',
    })
    @ApiResponse({
        status: 200,
        description: 'Category successfully deleted',
    })
    @ApiResponse({
        status: 404,
        description: 'Category not found',
    })
    async deleteCategory(@Param('id', ParseMongoIdPipe) id: string) {
        return this.movieCatagoryService.softDelete(id);
    }
}

