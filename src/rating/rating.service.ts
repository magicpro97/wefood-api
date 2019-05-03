import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from 'src/shared/base.service';
import { Rating } from './models/rating.model';
import { RatingParams } from './models/view-models/rating-params.models';

@Injectable()
export class RatingService extends BaseService<Rating> {
    async createFoodTag(params: RatingParams): Promise<Rating> {
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
