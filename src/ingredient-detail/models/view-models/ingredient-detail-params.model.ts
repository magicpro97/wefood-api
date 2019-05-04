import { ApiModelProperty } from '@nestjs/swagger';

export class IngredientDetailParams {
    @ApiModelProperty()
    ingredientId: string;

    @ApiModelProperty()
    quantity: number;
}
