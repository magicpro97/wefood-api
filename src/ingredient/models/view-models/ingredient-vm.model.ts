import { BaseModelVm } from '../../../shared/base.model-vm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class IngredientVm extends BaseModelVm {
    @ApiModelProperty() ingredientName: string;
    @ApiModelPropertyOptional() srcImage?: string;
}
