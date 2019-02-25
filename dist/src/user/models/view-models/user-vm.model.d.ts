import { BaseModelVm } from '../../../shared/base.model-vm';
import { UserRole } from '../user-role.enum';
export declare class UserVm extends BaseModelVm {
    username: string;
    firstname?: string;
    lastname?: string;
    fullname?: string;
    role?: UserRole;
    address?: string;
    email?: string;
    sex?: boolean;
    srcImage?: string;
    dob?: Date;
}
