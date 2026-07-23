import { Test, TestingModule } from '@nestjs/testing';
import { MovieCatagoryController } from './movie-catagory.controller';

describe('MovieCatagoryController', () => {
  let controller: MovieCatagoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieCatagoryController],
    }).compile();

    controller = module.get<MovieCatagoryController>(MovieCatagoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
