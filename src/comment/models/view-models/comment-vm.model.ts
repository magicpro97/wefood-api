import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModelVm } from '../../../shared/base.model-vm';

export class CommentVm extends BaseModelVm {
    @ApiModelProperty() userId: string;
    @ApiModelProperty() postId: string;
    @ApiModelProperty() content: string;
}
