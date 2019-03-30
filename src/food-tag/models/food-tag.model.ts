import { BaseModel } from 'dist/src/shared/base.model';
import { prop, ModelType } from 'typegoose';
import { schemaOptions } from 'src/shared/base.model';

export class FoodTag extends BaseModel<FoodTag> {
    @prop({ required: [true, 'Content is required'], unique: true })
    tagName: string;

    static get model(): ModelType<FoodTag> {
        return new FoodTag().getModelForClass(FoodTag, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
