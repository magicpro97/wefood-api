import { BaseModelVm } from 'src/shared/base.model-vm';
import { ApiModelProperty } from '@nestjs/swagger';

export class FoodTagVm extends BaseModelVm {
    @ApiModelProperty() tagName: string;
}
