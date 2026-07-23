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
} from '@nestjs/common';
import {
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WatchtimeService } from './watchtime.service';
import { UpdateWatchTimeDto } from './dto/update-watchtime.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@ApiTags('Watchtime')
@ApiBearerAuth('access-token')
@Controller('watchtime')
export class WatchtimeController {
  constructor(
    private readonly watchtimeService: WatchtimeService,
  ) {}

  @Patch('update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update watch time',
    description:
      'Updates continue watching for the logged-in user. Send token in Authorization header OR accessToken in body.',
  })
  @ApiBody({ type: UpdateWatchTimeDto })
  @ApiResponse({ status: 200, description: 'Watch time updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  async updateWatchTime(
    @Body() payload: UpdateWatchTimeDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.watchtimeService.updateWatchTime(user.userId, payload);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get continue watching',
    description:
      'Returns continue watching for the logged-in user. Send token via Authorization header or ?accessToken= query param.',
  })
  @ApiQuery({
    name: 'accessToken',
    required: false,
    description: 'JWT from login (use if Authorization header is not set)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiResponse({
    status: 200,
    description: 'Continue watching data retrieved successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  async getContinueWatching(@CurrentUser() user: { userId: string }) {
    return this.watchtimeService.getContinueWatching(user.userId);
  }

  @Delete(':movieId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove movie from continue watching',
  })
  @ApiParam({
    name: 'movieId',
    required: true,
    description: 'Movie ID',
    example: '6865c7b8c2f0b2f4a7f6c113',
  })
  @ApiResponse({ status: 200, description: 'Movie removed successfully' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  async removeMovie(
    @Param('movieId', ParseMongoIdPipe) movieId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.watchtimeService.removeMovie(user.userId, movieId);
  }
}
