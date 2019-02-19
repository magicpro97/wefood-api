import {ApiModelPropertyOptional} from '@nestjs/swagger';

export class BaseModelVm {
    @ApiModelPropertyOptional({type: String, format: 'date-time'})
    createAt?: Date;

    @ApiModelPropertyOptional({type: String, format: 'date-time'})
    updateAt?: Date;

    @ApiModelPropertyOptional()
    id?: string;
}
