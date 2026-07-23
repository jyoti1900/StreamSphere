import { HttpException } from '@nestjs/common';

export function rethrowIfHttpException(err: unknown): void {
  if (err instanceof HttpException) {
    throw err;
  }
}
