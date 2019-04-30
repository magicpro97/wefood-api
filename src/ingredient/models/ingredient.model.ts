import { BaseModel } from '../../shared/base.model';
import { prop, ModelType } from 'typegoose';
import { schemaOptions } from '../../shared/base.model';
export class Ingredient extends BaseModel<Ingredient> {
    @prop({ required: [true, 'Content is required'], unique: true })
    ingredientName: string;

    @prop()
    srcImage?: string;
    static get model(): ModelType<Ingredient> {
        return new Ingredient().getModelForClass(Ingredient, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
