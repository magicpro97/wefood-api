import { Module } from '@nestjs/common';
import { FoodPostController } from './food-post.controller';
import { FoodPostService } from './food-post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodPost } from './models/food-post.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: FoodPost.modelName, schema: FoodPost.model.schema },
        ]),
    ],
    controllers: [FoodPostController],
    providers: [FoodPostService],
})
export class FoodPostModule {}
