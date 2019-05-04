import { Module } from '@nestjs/common';
import { IngredientDetailController } from './ingredient-detail.controller';
import { IngredientDetailService } from './ingredient-detail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientDetail } from './models/ingredient-detail.models';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: IngredientDetail.modelName,
                schema: IngredientDetail.model.schema,
            },
        ]),
    ],
    controllers: [IngredientDetailController],
    providers: [IngredientDetailService],
    exports: [IngredientDetailService],
})
export class IngredientDetailModule {}
