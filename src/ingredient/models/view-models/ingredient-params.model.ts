import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class IngredientParams {
    // @ApiModelProperty() ingredientId: string;

    @ApiModelProperty() ingredientName: string;
}
