import { ApiModelProperty } from '@nestjs/swagger';

export class StepParams {
    @ApiModelProperty()
    content: string;
}
