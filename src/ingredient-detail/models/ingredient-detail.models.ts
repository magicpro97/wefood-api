import { BaseModel, schemaOptions } from '../../shared/base.model';
import { prop, ModelType } from 'typegoose';

export class IngredientDetail extends BaseModel<IngredientDetail> {
    @prop({ required: [true, 'ingredientId is required'] })
    ingredientId: string;

    @prop({ required: [true, 'quantity is required'] })
    quantity: number;

    static get model(): ModelType<IngredientDetail> {
        return new IngredientDetail().getModelForClass(IngredientDetail, {
            schemaOptions,
        });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
