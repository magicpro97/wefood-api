import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModelVm } from 'src/shared/base.model-vm';

export class IngredientDetailVm extends BaseModelVm {
    @ApiModelProperty()
    ingredientId: string;

    @ApiModelProperty()
    quantity: number;
}
