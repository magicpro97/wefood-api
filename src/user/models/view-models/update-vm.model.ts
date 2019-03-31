import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../user-role.enum';
import { ObjectId } from 'mongodb';
import { EnumToArray } from '../../../shared/utilities/enum-to-array';

export class UpdateVm {
    @ApiModelProperty()
    id: string;

    @ApiModelPropertyOptional()
    firstname?: string;

    @ApiModelPropertyOptional()
    lastname?: string;

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
