import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../user-role.enum';
import { EnumToArray } from '../../../shared/utilities/enum-to-array';

export class UpdateVm {
    @ApiModelProperty()
    id: string;

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
    followers?: string[];

    @ApiModelPropertyOptional()
    followings?: string[];

    @ApiModelPropertyOptional()
    foodTags?: string[];

    @ApiModelPropertyOptional()
    foodPost?: string[];
}
