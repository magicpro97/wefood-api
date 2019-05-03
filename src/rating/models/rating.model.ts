import { BaseModel, schemaOptions } from 'src/shared/base.model';
import { prop, ModelType } from 'typegoose';

export class Rating extends BaseModel<Rating> {
    @prop({ required: [true, 'userId is required'] })
    userId: string;

    @prop({ required: [true, 'postId is required'] })
    postId: string;

    @prop()
    star: number;

    static get model(): ModelType<Rating> {
        return new Rating().getModelForClass(Rating, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
