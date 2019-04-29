import { BaseModelVm } from '../../../shared/base.model-vm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class UnitVm extends BaseModelVm {
    // @ApiModelProperty() UnitId: string;
    @ApiModelProperty() unitName: string;
}
