import { stripBearerPrefix } from '../../auth/utils/extract-access-token.util';
import { Request, Response, NextFunction } from 'express';

/**
 * Copies access token from query or body into Authorization header
 * so JwtAuthGuard works for GET requests and clients that send token in body.
 */
export function authTokenMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  // If `accessToken` is sent in JSON body, remove it to avoid ValidationPipe
  // rejecting unknown fields (`forbidNonWhitelisted: true`).
  if ((req.body as any)?.accessToken) {
    delete (req.body as any).accessToken;
  }

  if (req.headers.authorization?.trim()) {
    next();
    return;
  }

  const queryToken = req.query.accessToken ?? req.query.token;
  const bodyToken = (req.body as { accessToken?: string } | undefined)
    ?.accessToken;
  const headerToken =
    req.headers['x-access-token'] ??
    req.headers['access-token'] ??
    req.headers['token'];

  const rawToken =
    (typeof queryToken === 'string' ? queryToken : undefined) ??
    (typeof bodyToken === 'string' ? bodyToken : undefined) ??
    (typeof headerToken === 'string' ? headerToken : undefined);

  if (rawToken?.trim()) {
    req.headers.authorization = `Bearer ${stripBearerPrefix(rawToken.trim())}`;
  }

  next();
}
