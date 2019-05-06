import { BaseModel, schemaOptions } from '../../shared/base.model';
import { prop, ModelType } from 'typegoose';

export class Step extends BaseModel<Step> {
    @prop({ required: [true, 'postId is required'] })
    postId: string;

    @prop({ required: [true, 'No is required'] })
    no: number;

    @prop({ required: [true, 'Content is required'] })
    content: string;

    static get model(): ModelType<Step> {
        return new Step().getModelForClass(Step, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
