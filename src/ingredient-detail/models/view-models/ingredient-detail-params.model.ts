import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class IngredientDetailParams {
    @ApiModelPropertyOptional()
    id?: string;

    @ApiModelProperty()
    postId: string;

    @ApiModelProperty()
    ingredientId: string;

    @ApiModelProperty()
    unitId: string;

    @ApiModelProperty()
    quantity: number;
}
