import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';

@ApiTags('Health Check')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Public()
    @Get()
    @ApiOperation({
        summary: 'Health check',
        description: 'Returns a simple message to verify API is running',
    })
    @ApiResponse({
        status: 200,
        description: 'API is healthy',
        schema: {
            example: 'Hello World!',
        },
    })
    getHello(): string {
        return this.appService.getHello();
    }
}
