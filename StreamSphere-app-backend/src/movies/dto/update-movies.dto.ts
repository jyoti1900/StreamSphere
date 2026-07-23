import { IsOptional, IsString, IsNumber, IsDateString, IsArray, IsEnum, Min, ValidateNested, IsMongoId } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MovieStatus, MovieType } from '../schema/movies.schema';
import { Type, Transform } from 'class-transformer';
import { CastDto } from './cast.dto';

export class UpdateMoviesDto {
  /* -- BASIC INFO -- */
    @ApiPropertyOptional({
        description: 'Movie title',
        example: 'The Matrix Reloaded',
        type: String,
    })
    @IsString()
    @IsOptional()
    title: string;
    
    @ApiPropertyOptional({
        description: 'Movie or series description',
        example: 'Neo and his allies race against time...',
        type: String,
    })
    @IsString()
    @IsOptional()
    description: string;
  
    @ApiPropertyOptional({
        description: 'Type of content',
        enum: ['movie', 'series'],
        example: 'movie',
    })
    @IsEnum(MovieType)
    @IsOptional()
    type: MovieType;
  
    @ApiPropertyOptional({
        description: 'Current status of movie',
        enum: ['draft', 'published', 'archived'],
        example: 'draft',
    })
    @IsOptional()
    @IsEnum(MovieStatus)
    status?: MovieStatus;
    
    @ApiPropertyOptional({
        description: 'Category ID',
        example: '65f1a3b2c5d8e9f0g1h2i3j3',
    })
    @IsOptional()
    @IsMongoId()
    category?: string;
    
    /* -- MEDIA -- */
    @ApiPropertyOptional({
        description: 'Updated thumbnail image document ID or uploaded file key',
        example: '65f1a3b2c5d8e9f0g1h2i3j4',
        type: String,
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    thumnailimage?: string;

    @ApiPropertyOptional({
        description: 'Updated poster image document ID or uploaded file key',
        example: '65f1a3b2c5d8e9f0g1h2i3j4',
        type: String,
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    posterimage?: string;
  
    @ApiPropertyOptional({
        description: 'Video file reference',
        example: 'movie-video-12345.mp4',
        type: String,
    })
    @IsOptional()
    @IsString()
    video?: string;
  
    /* -- SERIES ONLY -- */
    @ApiPropertyOptional({
        description: 'Total number of seasons (for series only)',
        example: 5,
        type: Number,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    totalSeasons?: number;
  
    @ApiPropertyOptional({
        description: 'Total number of episodes (for series only)',
        example: 50,
        type: Number,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    totalEpisodes?: number;
  
    /* -- METADATA -- */
    @ApiPropertyOptional({
        description: 'Release date in ISO 8601 format',
        example: '2003-05-15',
        type: String,
        format: 'date-time',
    })
    @IsDateString()
    @IsOptional()
    releaseDate: string;
  
    @ApiPropertyOptional({
        description: 'Age rating (e.g., PG, PG-13, R, NC-17)',
        example: 'R',
        type: String,
    })
    @IsOptional()
    @IsString()
    ageRating?: string;
  
    @ApiPropertyOptional({
        description: 'Primary audio language',
        example: 'English',
        type: String,
    })
    @IsOptional()
    @IsString()
    audiolanguage?: string;
  
    @ApiPropertyOptional({
        description: 'Available audio languages',
        example: ['English', 'Spanish', 'French'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    availableLanguages?: string[];
  
    @ApiPropertyOptional({
        description: 'Available subtitles',
        example: ['English', 'Spanish', 'French', 'German'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    subtitles?: string[];
  
    @ApiPropertyOptional({
        description: 'Movie tags/genres',
        example: ['Sci-Fi', 'Action', 'Sequel'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
  
    @ApiPropertyOptional({
        description: 'Country of origin',
        example: 'USA',
        type: String,
    })
    @IsOptional()
    @IsString()
    country?: string;
  
    /* -- CAST & CREW -- */
    @ApiPropertyOptional({
        description: 'Directors',
        example: ['Lana Wachowski', 'Lilly Wachowski'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    directors?: string[];
  
    @ApiPropertyOptional({
        description: 'Cast members with roles',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Keanu Reeves' },
                character: { type: 'string', example: 'Neo' },
            },
        },
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CastDto)
    cast?: CastDto[];
  
    /* -- RELATIONS -- */
    @ApiPropertyOptional({
        description: 'Related movie IDs',
        example: ['65f1a3b2c5d8e9f0g1h2i3j4'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    relatedMovies?: string[];
}