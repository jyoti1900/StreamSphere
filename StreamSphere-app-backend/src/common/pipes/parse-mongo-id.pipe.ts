import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!value || !Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid MongoDB ObjectId');
    }

    if (String(new Types.ObjectId(value)) !== value) {
      throw new BadRequestException('Invalid MongoDB ObjectId');
    }

    return value;
  }
}
