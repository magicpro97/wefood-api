import { BaseModel, schemaOptions } from '../../shared/base.model';
import { prop, ModelType } from 'typegoose';

export class Comment extends BaseModel<Comment> {
    @prop({ required: [true, 'userId is required'] })
    userId: string;

    @prop({ required: [true, 'postId is required'] })
    postId: string;

    @prop({ required: [true, 'postId is required'] })
    content: string;

    static get model(): ModelType<Comment> {
        return new Comment().getModelForClass(Comment, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
