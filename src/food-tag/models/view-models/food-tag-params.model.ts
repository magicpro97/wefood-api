import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class FoodTagParams {
    @ApiModelProperty() tagName: string;
}
