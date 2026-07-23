// contact.service.ts

import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ContactUsDto } from './dto/contact-us.dto';
import {
    Contact,
    ContactDocument,
} from './schema/contact-us.schema';
import { EmailService } from '../common/email/email.service';
import { rethrowIfHttpException } from '../common/utils/rethrow-http.exception';

@Injectable()
export class ContactService {
    constructor(
        @InjectModel(Contact.name)
        private readonly contactModel: Model<ContactDocument>,
        private readonly emailService: EmailService,
    ) { }

    async create(
        contactUsDto: ContactUsDto,
    ) {
        try {
            const contact =
                await this.contactModel.create(
                    contactUsDto,
                );

            // Send email in background
            this.emailService
                .sendContactUsEmail(
                    contactUsDto.name,
                    contactUsDto.email,
                    contactUsDto.subject,
                    contactUsDto.message,
                )
                .catch((error) => {
                    console.error(
                        'Contact email failed:',
                        error,
                    );
                });

            return {
                success: true,
                message:
                    'Your message has been submitted successfully.',
                data: contact,
            };
        } catch (error) {
            rethrowIfHttpException(error);
            throw new InternalServerErrorException(
                'Failed to submit contact form.',
            );
        }
    }
}