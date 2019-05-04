import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class IngredientParams {
    @ApiModelProperty() name: string;
    @ApiModelProperty() unitId: string;
    @ApiModelPropertyOptional() srcImage?: string;
}
