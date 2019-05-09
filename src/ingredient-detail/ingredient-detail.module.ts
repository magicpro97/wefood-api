import { Module } from '@nestjs/common';
import { IngredientDetailController } from './ingredient-detail.controller';
import { IngredientDetailService } from './ingredient-detail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientDetail } from './models/ingredient-detail.models';
import { IngredientModule } from 'src/ingredient/ingredient.module';
import { UnitModule } from 'src/unit/unit.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: IngredientDetail.modelName,
                schema: IngredientDetail.model.schema,
            },
        ]),
        IngredientModule,
        UnitModule,
    ],
    controllers: [IngredientDetailController],
    providers: [IngredientDetailService],
    exports: [IngredientDetailService],
})
export class IngredientDetailModule {}
