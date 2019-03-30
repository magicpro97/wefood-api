import { Module } from '@nestjs/common';
import { FoodTagController } from './food-tag.controller';
import { FoodTagService } from './food-tag/food-tag.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodTag } from './models/food-tag.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: FoodTag.modelName, schema: FoodTag.model.schema },
        ]),
    ],
    controllers: [FoodTagController],
    providers: [FoodTagService],
})
export class FoodTagModule {}
