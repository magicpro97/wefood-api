import { BaseModelVm } from '../../../shared/base.model-vm';
import { ApiModelProperty } from '@nestjs/swagger';

export class RatingVm extends BaseModelVm {
    @ApiModelProperty()
    userId: string;

    @ApiModelProperty()
    postId: string;

    @ApiModelProperty()
    star: number;
}
