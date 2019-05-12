import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class FoodTagParams {
    @ApiModelPropertyOptional({ description: 'Only use for PUT method' })
    id?: string;
    @ApiModelProperty() tagName: string;
    @ApiModelPropertyOptional() srcImage?: string;
}
