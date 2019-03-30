import { ApiModelProperty } from '@nestjs/swagger';

export class FoodTagParams {
    @ApiModelProperty() tagName: string;
}
