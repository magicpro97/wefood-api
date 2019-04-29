import { Injectable } from '@nestjs/common';
import { FoodPost } from './models/food-post.model';
import { BaseService } from '../shared/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';

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
}
