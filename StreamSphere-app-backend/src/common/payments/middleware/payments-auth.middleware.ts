import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { authTokenMiddleware } from '../../middleware/auth-token.middleware';

@Injectable()
export class PaymentsAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    authTokenMiddleware(req, res, next);
  }
}
