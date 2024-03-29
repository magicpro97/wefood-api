import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Rating } from './models/rating.model';
import { RatingParams } from './models/view-models/rating-params.models';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';

@Injectable()
export class RatingService extends BaseService<Rating> {
    constructor(
        @InjectModel(Rating.modelName)
        private readonly unitModel: ModelType<Rating>,
        private readonly mapperService: MapperService,
    ) {
        super();
        this.model = unitModel;
        this.mapper = mapperService.mapper;
    }

    async createRating(params: RatingParams): Promise<Rating> {
        const { userId, postId, star } = params;
        const newRating = new this.model();
        newRating.userId = userId;
        newRating.postId = postId;
        newRating.star = star;

        try {
            const result = await this.create(newRating);
            return result.toJSON() as Rating;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
