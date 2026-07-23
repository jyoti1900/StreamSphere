import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MovieStatus, MovieType } from '../schema/movies.schema';
import { CastDto } from './cast.dto';

export class CreateMovieDto {
  /* -- BASIC INFO -- */
  @ApiProperty({
    description: 'Movie title',
    example: 'The Matrix',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Movie category ID (MongoDB ObjectId)',
    example: '65f1a3b2c5d8e9f0g1h2i3j4',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  category: string;

  @ApiProperty({
    description: 'Movie or series description',
    example: 'A computer programmer discovers the reality he lives in is a simulated world.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Type of content',
    enum: ['movie', 'series'],
    example: 'movie',
  })
  @IsEnum(MovieType)
  type: MovieType;

  @ApiPropertyOptional({
    description: 'Current status of movie',
    enum: ['draft', 'published', 'archived'],
    example: 'draft',
  })
  @IsOptional()
  @IsEnum(MovieStatus)
  status?: MovieStatus;

  /* -- MEDIA -- */
  @ApiPropertyOptional({
    description: 'Thumbnail image document ID or uploaded file key',
    example: '65f1a3b2c5d8e9f0g1h2i3j4',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  thumnailimage?: string;

  @ApiPropertyOptional({
    description: 'Poster image document ID or uploaded file key',
    example: '65f1a3b2c5d8e9f0g1h2i3j4',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  posterimage?: string;

  /* -- SERIES ONLY -- */
  @ApiPropertyOptional({
    description: 'Total number of seasons (for series only)',
    example: 4,
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
    example: 48,
    type: Number,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  totalEpisodes?: number;

  /* -- METADATA -- */
  @ApiProperty({
    description: 'Release date in ISO 8601 format',
    example: '1999-03-31',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
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
    description: 'Available audio languages as JSON array',
    example: ["English", "Spanish", "French"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableLanguages?: string[];

  @ApiPropertyOptional({
    description: 'Available subtitles as JSON array',
    example: ["English", "Spanish", "French", "German"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subtitles?: string[];

  @ApiPropertyOptional({
    description: 'Movie tags/genres as JSON array',
    example: ["Sci-Fi", "Action", "Thriller"],
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
    description: 'Directors as JSON array',
    example: ["Lana Wachowski", "Lilly Wachowski"],
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
        role: { type: 'string', example: 'Neo' },
      },
      required: ['name'],
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
    example: ['65f1a3b2c5d8e9f0g1h2i3j4', '65f1a3b2c5d8e9f0g1h2i3j5'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  relatedMovies?: string[];
}
