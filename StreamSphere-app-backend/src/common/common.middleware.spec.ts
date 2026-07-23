import { CommonMiddleware } from './common.middleware';
import { ConfigService } from '@nestjs/config';

describe('CommonMiddleware', () => {
  it('should be defined', () => {
    const mockConfigService = {
      get: jest.fn(),
    } as unknown as ConfigService;
    expect(new CommonMiddleware(mockConfigService)).toBeDefined();
  });
});