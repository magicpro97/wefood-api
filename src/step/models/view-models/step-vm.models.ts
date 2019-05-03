import { BaseModelVm } from 'src/shared/base.model-vm';
import { ApiModelProperty } from '@nestjs/swagger';

export class StepVm extends BaseModelVm {
    @ApiModelProperty()
    content: string;
}
