import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { FoodTag } from './models/food-tag.model';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { FoodTagParams } from './models/view-models/food-tag-params.model';
import { unlink } from 'fs';
@Injectable()
export class FoodTagService extends BaseService<FoodTag> {
    constructor(
        @InjectModel(FoodTag.modelName)
        private readonly foodTagModel: ModelType<FoodTag>,
        private readonly mapperService: MapperService,
    ) {
        super();
        this.model = foodTagModel;
        this.mapper = mapperService.mapper;
    }

    async createFoodTag(params: FoodTagParams): Promise<FoodTag> {
        const { tagName } = params;

        const newFoodTag = new this.model();

        newFoodTag.tagName = tagName;

        try {
            const result = await this.create(newFoodTag);
            return result.toJSON() as FoodTag;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteImageFile(path: string) {
        const imagePath = '.' + path.substring(path.indexOf('/'), path.length);
        unlink(imagePath, err => {
            if (err) {
                throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
