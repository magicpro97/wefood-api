import { Injectable, HttpException, HttpStatus, Post } from '@nestjs/common';
import { FoodPost } from './models/food-post.model';
import { BaseService } from '../shared/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { FoodPostPrams } from './models/view-models/food-post-params.model';

@Injectable()
export class FoodPostService extends BaseService<FoodPost> {
    constructor(
        @InjectModel(FoodPost.modelName)
        private readonly foodPostModel: ModelType<FoodPost>,
        private readonly mapperService: MapperService,
    ) {
        super();
        this.model = foodPostModel;
        this.mapper = mapperService.mapper;
    }
    async createFoodPost(params: FoodPostPrams): Promise<FoodPost> {
        const {
            userId,
            title,
            description,
            timeEstimate,
            foodTagIds,
            stepIds,
            ingredientDetailId,
            srcImages,
        } = params;

        const newFoodPost = new this.model();
        newFoodPost.userId = userId;
        newFoodPost.title = title;
        newFoodPost.description = description;
        newFoodPost.timeEstimate = timeEstimate;
        newFoodPost.foodTagIds = foodTagIds;
        newFoodPost.stepIds = stepIds;
        newFoodPost.ingredientDetailId = ingredientDetailId;
        newFoodPost.srcImages = srcImages;
        try {
            const result = await this.create(newFoodPost);
            return result.toJSON() as FoodPost;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
