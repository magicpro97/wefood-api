import { BaseModelVm } from '../../../shared/base.model-vm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class FoodPostVm extends BaseModelVm {
    @ApiModelProperty() userId: string;
    @ApiModelProperty() title: string;
    @ApiModelPropertyOptional() description?: string;
    @ApiModelPropertyOptional() timeEstimate?: number;
    @ApiModelPropertyOptional() foodTagIds?: string[];
    @ApiModelPropertyOptional() stepIds?: string[];
    @ApiModelPropertyOptional() ingredientDetailId?: string[];
    @ApiModelPropertyOptional() srcImages?: string[];
}
