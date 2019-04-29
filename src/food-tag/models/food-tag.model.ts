import { BaseModel } from '../../shared/base.model';
import { prop, ModelType } from 'typegoose';
import { schemaOptions } from '../../shared/base.model';

export class FoodTag extends BaseModel<FoodTag> {
    @prop({ required: [true, 'tagName is required'], unique: true })
    tagName: string;

    @prop()
    srcImage?: string;

    static get model(): ModelType<FoodTag> {
        return new FoodTag().getModelForClass(FoodTag, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
