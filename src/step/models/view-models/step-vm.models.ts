import { BaseModelVm } from '../../../shared/base.model-vm';
import { ApiModelProperty } from '@nestjs/swagger';

export class StepVm extends BaseModelVm {
    @ApiModelProperty()
    postId: string;
    @ApiModelProperty()
    no: number;
    @ApiModelProperty()
    content: string;
}
