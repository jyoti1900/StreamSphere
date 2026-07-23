// contact.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Contact,
  ContactSchema,
} from './schema/contact-us.schema';
import { ContactController } from './contact-us.controller';
import { ContactService } from './contact-us.service';
import { EmailModule } from '../common/email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Contact.name,
        schema: ContactSchema,
      },
    ]),
    EmailModule,
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}