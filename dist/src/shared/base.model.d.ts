import { Typegoose } from 'typegoose';
import { SchemaOptions } from 'mongoose';
export declare class BaseModel<T> extends Typegoose {
    createAt?: Date;
    updateAt?: Date;
    id?: string;
}
export declare const schemaOptions: SchemaOptions;
