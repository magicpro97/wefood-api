import { BaseModel, schemaOptions } from '../../shared/base.model';
import { ModelType, prop } from 'typegoose';
import { Long } from 'bson';

export class FoodPost extends BaseModel<FoodPost> {
    @prop({ required: [true, 'userId is required'] })
    userId: string;

    @prop()
    title: string;

    @prop()
    description?: string;

    @prop()
    timeEstimate?: number;

    static get model(): ModelType<FoodPost> {
        return new FoodPost().getModelForClass(FoodPost, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
