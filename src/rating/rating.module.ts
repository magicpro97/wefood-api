import { Module, forwardRef } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating } from './models/rating.model';
import { FoodPostModule } from '../food-post/food-post.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Rating.modelName,
                schema: Rating.model.schema,
            },
        ]),
        forwardRef(() => FoodPostModule),
    ],
    providers: [RatingService],
    controllers: [RatingController],
    exports: [RatingService],
})
export class RatingModule {}
