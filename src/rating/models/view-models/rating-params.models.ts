import { ApiModelProperty } from '@nestjs/swagger';

export class RatingParams {
    @ApiModelProperty()
    userId: string;

    @ApiModelProperty()
    postId: string;

    @ApiModelProperty()
    star: number;
}
