import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { ContactService } from './contact-us.service';
import { ContactUsDto } from './dto/contact-us.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Contact Us')
@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Submit contact form',
    description:
      'Allows users to send a message through the Contact Us form.',
  })
  @ApiBody({
    type: ContactUsDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Contact form submitted successfully.',
    schema: {
      example: {
        success: true,
        message:
          'Your message has been submitted successfully.',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async contactUs(
    @Body() contactUsDto: ContactUsDto,
  ) {
    return this.contactService.create(
      contactUsDto,
    );
  }
}