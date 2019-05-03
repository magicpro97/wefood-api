import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating } from './models/rating.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Rating.modelName,
                schema: Rating.model.schema,
            },
        ]),
    ],
    providers: [RatingService],
    controllers: [RatingController],
    exports: [RatingService],
})
export class RatingModule {}
