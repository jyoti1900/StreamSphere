import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movies.dto';
import { UpdateMoviesDto } from './dto/update-movies.dto';
import { CreateMovieImgaesDto, UpdateMovieImgaesDto } from './dto/movie-images.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Public } from '../auth/decorators/public.decorator';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) { }

    @AdminOnly()
    @Post('create')
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Create a new movie',
        description: 'Creates a new movie or series with media files and metadata',
    })
    @ApiBody({
        type: CreateMovieDto,
        description: 'Movie creation data',
    })
    @ApiResponse({
        status: 201,
        description: 'Movie successfully created',
        schema: {
            example: {
                _id: '65f1a3b2c5d8e9f0g1h2i3j4',
                title: 'The Matrix',
                category: '65f1a3b2c5d8e9f0g1h2i3j3',
                description: 'A computer programmer discovers...',
                type: 'movie',
                duration: 136,
                releaseDate: '1999-03-31',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Validation failed',
    })
    async createMovie(@Body() movieData: CreateMovieDto) {
        console.log('Received movie data:', movieData);
        return this.moviesService.create(movieData);
    }

    @Public()
    @Get('list')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get movies by category',
        description: 'Retrieves all movies for a specific category',
    })
    @ApiQuery({
        name: 'categoryId',
        description: 'Category ID (MongoDB ObjectId)',
        example: '65f1a3b2c5d8e9f0g1h2i3j4',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: 'List of movies in category',
        schema: {
            example: [
                {
                    _id: '65f1a3b2c5d8e9f0g1h2i3j4',
                    title: 'The Matrix',
                    category: '65f1a3b2c5d8e9f0g1h2i3j3',
                    description: 'A computer programmer discovers...',
                    type: 'movie',
                    thumnailimage: {
                        _id: '69aef2a8b625f2cb381ba809',
                        key: 'movies/sample.png',
                        signedUrl: 'https://cloudfront-url/...'
                    },
                    posterimage: {
                        _id: '69aef2a8b625f2cb381ba809',
                        key: 'movies/sample.png',
                        signedUrl: 'https://cloudfront-url/...'
                    }
                }
            ],
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid or missing categoryId',
    })
    async listMovies(@Query('categoryId', ParseMongoIdPipe) categoryId: string) {
        return this.moviesService.list(categoryId);
    }

    @AdminOnly()
    @Put('update')
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Update a movie',
        description: 'Updates movie details and optionally uploads new media files',
    })
    @ApiQuery({
        name: 'itemId',
        description: 'Movie ID (MongoDB ObjectId)',
        example: '65f1a3b2c5d8e9f0g1h2i3j4',
        required: true,
    })
    @ApiBody({
        type: UpdateMoviesDto,
        description: 'Movie update data',
    })
    @ApiResponse({
        status: 200,
        description: 'Movie successfully updated',
    })
    @ApiResponse({
        status: 404,
        description: 'Movie not found',
    })
    async updateMovie(
        @Query('itemId', ParseMongoIdPipe) itemId: string,
        @Body() movieData: UpdateMoviesDto,
    ) {
        return this.moviesService.update(itemId, movieData);
    }

    @AdminOnly()
    @Delete('delete')
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Delete a movie',
        description: 'Soft deletes a movie. Requires admin access token.',
    })
    @ApiQuery({
        name: 'itemId',
        description: 'Movie ID (MongoDB ObjectId)',
        example: '65f1a3b2c5d8e9f0g1h2i3j4',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: 'Movie successfully deleted',
    })
    @ApiResponse({
        status: 404,
        description: 'Movie not found',
    })
    remove(@Query('itemId', ParseMongoIdPipe) itemId: string) {
        return this.moviesService.softDelete(itemId);
    }

    @Public()
    @Get('grouped')
    @ApiOperation({
        summary: 'Get movies grouped by category',
        description: 'Retrieves all movies grouped by their categories with signed image URLs',
    })
    @ApiResponse({
        status: 200,
        description: 'Movies grouped by category',
        schema: {
            example: [
                {
                    _id: '65f1a3b2c5d8e9f0g1h2i3j3',
                    category: 'Action',
                    movies: [
                        {
                            _id: '65f1a3b2c5d8e9f0g1h2i3j4',
                            title: 'The Matrix',
                            thumnailimage: {
                                _id: '69aef2a8b625f2cb381ba809',
                                key: 'movies/sample.png',
                                signedUrl: 'https://cloudfront-url/...'
                            },
                            posterimage: {
                                _id: '69aef2a8b625f2cb381ba810',
                                key: 'movies/sample.png',
                                signedUrl: 'https://cloudfront-url/...'
                            }
                        }
                    ]
                }
            ],
        },
    })
    async listGrouped() {
        return this.moviesService.listGroupedByCategory();
    }

    @AdminOnly()
    @Post("images")
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Add images to a movie',
        description: 'Adds thumbnail and/or poster images to an existing movie',
    })
    @ApiQuery({
        name: '_id',
        description: 'Movie ID (MongoDB ObjectId)',
        example: '65f1a3b2c5d8e9f0g1h2i3j4',
        required: true,
    })
    @ApiBody({
        type: CreateMovieImgaesDto,
        description: 'Image data for the movie',
    })
    @ApiResponse({
        status: 201,
        description: 'Images successfully added',
    })
    @ApiResponse({
        status: 404,
        description: 'Movie not found',
    })
    async createImages(@Query('_id', ParseMongoIdPipe) _id: string, @Body() dto: CreateMovieImgaesDto) {
        return this.moviesService.addImages(_id, dto);
    }

    @AdminOnly()
    @Put('update-images')
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Update movie images',
        description: 'Updates thumbnail and/or poster images for an existing movie',
    })
    @ApiQuery({
        name: '_id',
        description: 'Movie ID (MongoDB ObjectId)',
        example: '65f1a3b2c5d8e9f0g1h2i3j4',
        required: true,
    })
    @ApiBody({
        type: UpdateMovieImgaesDto,
        description: 'Updated image data',
    })
    @ApiResponse({
        status: 200,
        description: 'Images successfully updated',
    })
    @ApiResponse({
        status: 404,
        description: 'Movie not found',
    })
    async updateImages(@Query('_id', ParseMongoIdPipe) _id: string, @Body() dto: UpdateMovieImgaesDto) {
        return this.moviesService.updateImages(_id, dto);
    }

    /**
     * Saves the S3 object key after the frontend completes a direct presigned POST upload.
     * Call this endpoint once S3 confirms the upload succeeded.
     *
     * PATCH /movies/:id/video
     * Body: { videoKey: 'movies/uuid-filename.mp4' }
     */
    @AdminOnly()
    @Patch(':id/video')
    @ApiBearerAuth('access-token')
    async saveVideoKey(@Param('id', ParseMongoIdPipe) id: string, @Body() dto: UpdateVideoDto) {
        return this.moviesService.saveVideoKey(id, dto.videoKey, dto.duration);
    }

    /**
     * Generates a time-limited CloudFront signed URL for streaming the movie.
     *
     * GET /movies/:id/stream
     * Response: { streamingUrl: 'https://d1234.cloudfront.net/movies/uuid.mp4?...' }
     */
    @Public()
    @Get(':id/stream')
    @HttpCode(HttpStatus.OK)
    async streamMovie(@Param('id', ParseMongoIdPipe) id: string) {
        return this.moviesService.getStreamingUrl(id);
    }

}
