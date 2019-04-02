import { BaseModelVm } from '../../../shared/base.model-vm';
import { UserRole } from '../user-role.enum';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { EnumToArray } from '../../../shared/utilities/enum-to-array';
import { ObjectId } from 'bson';

export class UserVm extends BaseModelVm {
    @ApiModelProperty()
    username: string;

    @ApiModelProperty()
    password: string;
    
    @ApiModelPropertyOptional()
    firstName?: string;

    @ApiModelPropertyOptional()
    lastName?: string;

    @ApiModelPropertyOptional()
    fullname?: string;

    @ApiModelPropertyOptional({ enum: EnumToArray(UserRole) })
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

    @ApiModelPropertyOptional()
    followers?: ObjectId[];

    @ApiModelPropertyOptional()
    followings?: ObjectId[];

    @ApiModelPropertyOptional()
    foodTags?: ObjectId[];

    @ApiModelPropertyOptional()
    articles?: ObjectId[];
}
