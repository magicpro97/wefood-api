import { ApiModelProperty } from '@nestjs/swagger';

export class IngredientDetailParams {
    @ApiModelProperty()
    ingredientId: string;

    @ApiModelProperty()
    unitId: string;

    @ApiModelProperty()
    quantity: number;
}
