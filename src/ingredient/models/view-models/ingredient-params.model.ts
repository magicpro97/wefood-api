import { ApiModelProperty } from '@nestjs/swagger';

export class IngredientParams {
    @ApiModelProperty() ingredientName: string;
}
