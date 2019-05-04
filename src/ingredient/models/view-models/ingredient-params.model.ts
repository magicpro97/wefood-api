import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class IngredientParams {
    @ApiModelProperty() name: string;
    @ApiModelPropertyOptional() srcImage?: string;
}
