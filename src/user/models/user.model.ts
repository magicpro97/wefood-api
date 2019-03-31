import { BaseModel, schemaOptions } from '../../shared/base.model';
import { UserRole } from './user-role.enum';
import { ModelType, prop } from 'typegoose';
import { ObjectId } from 'bson';

export class User extends BaseModel<User> {
    @prop({
        required: [true, 'Username is required'],
        minlength: [6, 'Must be at least 6 characters'],
        unique: true,
    })
    username: string;

    @prop({
        required: [true, 'Password is required'],
        minlength: [6, 'Must be at least 6 characters'],
    })
    password: string;

    @prop({ enum: UserRole, default: UserRole.User })
    role?: UserRole;

    @prop()
    firstName?: string;

    @prop()
    lastName?: string;
    @prop()
    address?: string;
    @prop()
    dob?: Date;
    @prop()
    sex?: boolean;
    @prop()
    srcImage?: string;
    @prop()
    email?: string;
    @prop()
    followings?: ObjectId[];
    @prop()
    followers?: ObjectId[];
    @prop()
    foodTags?: ObjectId[];
    @prop()
    articles?: ObjectId[];

    static get model(): ModelType<User> {
        return new User().getModelForClass(User, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
