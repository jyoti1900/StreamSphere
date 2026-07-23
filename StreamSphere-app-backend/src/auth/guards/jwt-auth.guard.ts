import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtPayload, AuthRole } from '../interfaces/jwt-payload.interface';
import { UserStatus } from '../../users/schema/users.schema';

import { extractAccessToken } from '../utils/extract-access-token.util';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = extractAccessToken(request);

    if (!token) {
      throw new UnauthorizedException(
        'Missing access token. Send Authorization: Bearer <token>, x-access-token header, or ?accessToken= query param.',
      );
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);

      if (payload.role !== AuthRole.ADMIN) {
        if (payload.status === UserStatus.BLOCKED) {
          throw new UnauthorizedException('Account is blocked');
        }

        if (payload.status === UserStatus.INACTIVE) {
          throw new UnauthorizedException('Account is inactive');
        }
      }

      (request as Request & { user: JwtPayload }).user = payload;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
