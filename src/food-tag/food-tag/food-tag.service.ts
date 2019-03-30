import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from 'dist/src/shared/base.service';
import { FoodTag } from '../models/food-tag.model';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from 'src/shared/mapper/mapper.service';
import { FoodTagParams } from '../models/view-models/food-tag-params.model';

@Injectable()
export class FoodTagService extends BaseService<FoodTag>{
    constructor(
        @InjectModel(FoodTag.modelName) private readonly _foodTagModel: ModelType<FoodTag>,
        private readonly _mapperService: MapperService,
    ) {
        super();
        this.model = _foodTagModel;
        this.mapper = _mapperService.mapper;
    }

    async createFoodTag(params: FoodTagParams): Promise<FoodTag> {
        const { tagName} = params;

        const newFoodTag = new this.model();

        newFoodTag.tagName = tagName;

        try {
            const result = await this.create(newFoodTag);
            return result.toJSON() as FoodTag;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
