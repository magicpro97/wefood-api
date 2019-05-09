import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModelVm } from '../../../shared/base.model-vm';
import { IngredientVm } from '../../../ingredient/models/view-models/ingredient-vm.model';
import { UnitVm } from '../../../unit/models/view-models/unit-vm.model';

export class IngredientDetailVm extends BaseModelVm {
    @ApiModelProperty()
    postId: string;

    @ApiModelProperty()
    ingredient: IngredientVm;

    @ApiModelProperty()
    unit: UnitVm;

    @ApiModelProperty()
    quantity: number;
}
