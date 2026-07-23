import { Test, TestingModule } from '@nestjs/testing';
import { MovieCatagoryService } from './movie-catagory.service';

describe('MovieCatagoryService', () => {
  let service: MovieCatagoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovieCatagoryService],
    }).compile();

    service = module.get<MovieCatagoryService>(MovieCatagoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
