import { BaseModelVm } from '../../../shared/base.model-vm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class IngredientVm extends BaseModelVm {
    @ApiModelProperty() name: string;
    @ApiModelProperty() isApproved?: boolean;
    @ApiModelPropertyOptional() srcImage?: string;
}
