import { ApiModelProperty } from '@nestjs/swagger';

export class StepParams {
    @ApiModelProperty()
    postId: string;
    @ApiModelProperty()
    no: number;
    @ApiModelProperty()
    content: string;
}
