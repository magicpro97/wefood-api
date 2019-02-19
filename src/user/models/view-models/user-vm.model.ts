import {BaseModelVm} from '../../../shared/base.model-vm';
import {UserRole} from '../user-role.enum';
import {ApiModelProperty, ApiModelPropertyOptional} from '@nestjs/swagger';
import {EnumToArray} from '../../../shared/utilities/enum-to-array';

export class UserVm extends BaseModelVm {
    @ApiModelProperty()
    username: string;

    @ApiModelPropertyOptional()
    firstname?: string;

    @ApiModelPropertyOptional()
    lastname?: string;

    @ApiModelPropertyOptional()
    fullname?: string;

    @ApiModelPropertyOptional({enum: EnumToArray(UserRole)})
    role?: UserRole;

    @ApiModelPropertyOptional()
    address?: string;

    @ApiModelPropertyOptional()
    email?: string;

    @ApiModelPropertyOptional()
    sex?: boolean;

    @ApiModelPropertyOptional()
    srcImage?: string;

    @ApiModelPropertyOptional()
    dob?: Date;
}
