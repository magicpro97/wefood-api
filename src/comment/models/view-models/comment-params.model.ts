import { ApiModelProperty } from '@nestjs/swagger';

export class CommentParams {
    @ApiModelProperty() userId: string;
    @ApiModelProperty() postId: string;
    @ApiModelProperty() content: string;
}
