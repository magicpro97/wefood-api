import { Module } from '@nestjs/common';
import { FoodPostController } from './food-post.controller';
import { FoodPostService } from './food-post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodPost } from './models/food-post.model';
import { FoodTagModule } from '../food-tag/food-tag.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: FoodPost.modelName, schema: FoodPost.model.schema },
        ]),
        FoodTagModule,
    ],
    controllers: [FoodPostController],
    providers: [FoodPostService],
    exports: [FoodPostService],
})
export class FoodPostModule {}
