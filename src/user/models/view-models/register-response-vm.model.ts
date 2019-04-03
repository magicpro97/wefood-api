import {LoginVm} from './login-vm.model';
import {ApiModelPropertyOptional, ApiModelProperty} from '@nestjs/swagger';

export class RegisterVm extends LoginVm {
    @ApiModelProperty()
    username: string;

    @ApiModelProperty()
    password: string;

    @ApiModelPropertyOptional()
    firstName?: string;

    @ApiModelPropertyOptional()
    lastName?: string;

    @ApiModelPropertyOptional()
    sex?: boolean;

    @ApiModelPropertyOptional()
    address?: string;

    @ApiModelPropertyOptional()
    email?: string;

    @ApiModelPropertyOptional({type: String, format: 'date-time'})
    dob?: Date;

    @ApiModelPropertyOptional()
    srcImage?: string;
}
