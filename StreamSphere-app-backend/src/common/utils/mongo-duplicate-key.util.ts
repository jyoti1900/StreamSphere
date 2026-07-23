import { ConflictException } from '@nestjs/common';
import { MongoServerError } from 'mongodb';

export function throwIfDuplicateKey(err: unknown, fieldLabels: Record<string, string> = {}): void {
  if (err instanceof MongoServerError && err.code === 11000) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? 'field';
    const label = fieldLabels[field] ?? field;
    throw new ConflictException(`${label} already exists`);
  }
}
