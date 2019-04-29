import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class FoodPostPrams {
    @ApiModelProperty() userId: string;
    @ApiModelProperty() title: string;
    @ApiModelPropertyOptional() description?: string;
    @ApiModelPropertyOptional() timeEstimate?: number;
}
