import { MongooseModule, InjectModel } from '@nestjs/mongoose';
import { Ingredient } from './models/ingredient.model';
import { Module } from '@nestjs/common';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Ingredient.modelName,
                schema: Ingredient.model.schema,
            },
        ]),
    ],
    controllers: [IngredientController],
    providers: [IngredientService],
    exports: [IngredientService],
})
export class IngredientModule {}
