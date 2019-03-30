import { Test, TestingModule } from '@nestjs/testing';
import { FoodTagService } from './food-tag.service';

describe('FoodTagService', () => {
  let service: FoodTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodTagService],
    }).compile();

    service = module.get<FoodTagService>(FoodTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
