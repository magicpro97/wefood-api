import { Test, TestingModule } from '@nestjs/testing';
import { FoodTagController } from './food-tag.controller';

describe('FoodTag Controller', () => {
  let controller: FoodTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodTagController],
    }).compile();

    controller = module.get<FoodTagController>(FoodTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
