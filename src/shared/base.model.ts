import { pre, prop, Typegoose } from 'typegoose';
import { SchemaOptions } from 'mongoose';

@pre<T>('findOneAndUpdate', function(next) {
    this.update.updateAt = new Date(Date.now());
    next();
})
export class BaseModel<T> extends Typegoose {
    @prop({ default: Date.now() })
    createAt?: Date;

    @prop({ default: Date.now() })
    updateAt?: Date;

    id?: string;
}

export const schemaOptions: SchemaOptions = {
    toJSON: {
        virtuals: true,
        getters: true,
    },
};
