import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateVideoDto {
    @ApiProperty({
        description: 'S3 object key returned by POST /upload/presigned-post',
        example: 'movies/uuid-movie.mp4',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    videoKey!: string;

    @ApiProperty({
        description: 'Video duration in seconds',
        example: 1800,
        type: Number,
        minimum: 0,
    })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    duration!: number;
}
