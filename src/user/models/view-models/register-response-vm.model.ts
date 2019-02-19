import {LoginVm} from './login-vm.model';
import {ApiModelPropertyOptional} from '@nestjs/swagger';

export class RegisterVm extends LoginVm {
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
