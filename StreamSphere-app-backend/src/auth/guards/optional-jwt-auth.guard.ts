import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserStatus } from '../../users/schema/users.schema';
import { extractAccessToken } from '../utils/extract-access-token.util';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractAccessToken(request);

    if (!token) {
      return true;
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);

      if (
        payload.status !== UserStatus.BLOCKED &&
        payload.status !== UserStatus.INACTIVE
      ) {
        (request as Request & { user: JwtPayload }).user = payload;
      }
    } catch {
      // Invalid token — leave user unset; route handler will reject if needed
    }

    return true;
  }
}
