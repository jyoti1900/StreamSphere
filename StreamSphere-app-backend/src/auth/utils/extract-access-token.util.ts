import { Request } from 'express';

export function stripBearerPrefix(value: string): string {
  let token = value.trim();
  while (/^bearer\s+/i.test(token)) {
    token = token.replace(/^bearer\s+/i, '').trim();
  }
  return token;
}

export function extractAccessToken(request: Request): string | undefined {
  const authorization = request.headers.authorization?.trim();
  if (authorization) {
    return stripBearerPrefix(authorization);
  }

  const headerToken =
    request.headers['x-access-token'] ??
    request.headers['access-token'] ??
    request.headers['token'];

  if (typeof headerToken === 'string' && headerToken.trim()) {
    return stripBearerPrefix(headerToken.trim());
  }

  const queryToken = request.query.accessToken ?? request.query.token;
  if (typeof queryToken === 'string' && queryToken.trim()) {
    return stripBearerPrefix(queryToken.trim());
  }

  const body = request.body as { accessToken?: string } | undefined;
  if (body?.accessToken && typeof body.accessToken === 'string') {
    return stripBearerPrefix(body.accessToken);
  }

  return undefined;
}
