import { Injectable, HttpException, HttpStatus, Post } from '@nestjs/common';
import { FoodPost } from './models/food-post.model';
import { BaseService } from '../shared/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { FoodPostModel } from './models/view-models/food-post.model';
import { FoodPostVm } from './models/view-models/food-post-vm.model';

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
    async createFoodPost(params: FoodPostModel): Promise<FoodPostVm> {
        const {
            userId,
            title,
            description,
            timeEstimate,
            srcImages,
            foodTagIds,
        } = params;
        const newFoodPostVm = new FoodPostVm();
        newFoodPostVm.title = title;
        newFoodPostVm.description = description;
        newFoodPostVm.timeEstimate = timeEstimate;
        newFoodPostVm.srcImages = srcImages;

        const newFoodPost = new this.model();
        newFoodPost.userId = userId;
        newFoodPost.title = title;
        newFoodPost.description = description;
        newFoodPost.timeEstimate = timeEstimate;
        newFoodPost.srcImages = srcImages;
        newFoodPost.foodTagIds = foodTagIds;
        newFoodPostVm.createAt = newFoodPost.createAt;
        newFoodPostVm.updateAt = newFoodPost.updateAt;

        try {
            const result = await this.create(newFoodPost);
            newFoodPostVm.id = result.id;
            return newFoodPostVm;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findTrendingPost(filter = {}): Promise<FoodPost[]> {
        return this.model
            .find(filter)
            .limit(10)
            .sort({ ratingCount: -1 })
            .exec();
    }

    async findRandomPost(filter = {}): Promise<FoodPost[]> {
        const count = await this.model.count(filter).exec();
        const random = Math.floor(Math.random() * count);
        const foodPosts: FoodPost[] = [];
        for (let i = 0; i < 5; i++) {
            foodPosts.push(
                await this.model
                    .findOne(filter)
                    .skip(random)
                    .exec(),
            );
        }
        return foodPosts;
    }
}
