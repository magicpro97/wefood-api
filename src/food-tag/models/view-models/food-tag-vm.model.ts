import { BaseModelVm } from '../../../shared/base.model-vm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class FoodTagVm extends BaseModelVm {
    @ApiModelProperty() tagName: string;
    @ApiModelPropertyOptional() srcImage?: string;
}
