import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class IngredientParams {
    @ApiModelProperty() ingredientName: string;
}
