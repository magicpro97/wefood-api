import { BaseModel } from '../../shared/base.model';
import { UserRole } from './user-role.enum';
import { ModelType } from 'typegoose';
export declare class User extends BaseModel<User> {
    username: string;
    password: string;
    role?: UserRole;
    firstName?: string;
    lastName?: string;
    address?: string;
    dob?: Date;
    sex?: boolean;
    srcImage?: string;
    email?: string;
    static readonly model: ModelType<User>;
    static readonly modelName: string;
    readonly fullName: string;
}
