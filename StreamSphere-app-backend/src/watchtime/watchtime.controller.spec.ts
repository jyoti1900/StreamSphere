import { Test, TestingModule } from '@nestjs/testing';
import { WatchtimeController } from './watchtime.controller';

describe('WatchtimeController', () => {
  let controller: WatchtimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchtimeController],
    }).compile();

    controller = module.get<WatchtimeController>(WatchtimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
