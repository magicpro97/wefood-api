import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModelVm } from '../../../shared/base.model-vm';

export class IngredientDetailVm extends BaseModelVm {
    @ApiModelProperty()
    ingredientId: string;

    @ApiModelProperty()
    unitId: string;

    @ApiModelProperty()
    quantity: number;
}
