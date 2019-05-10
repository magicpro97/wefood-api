import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

// tslint:disable-next-line: max-classes-per-file
class StepParam {
    @ApiModelProperty()
    no: number;

    @ApiModelProperty()
    content: string;
}

// tslint:disable-next-line: max-classes-per-file
class IngredientDetailParam {
    @ApiModelProperty()
    ingredientName: string;

    @ApiModelProperty()
    unit: string;

    @ApiModelProperty()
    quantity: number;
}

// tslint:disable-next-line: max-classes-per-file
export class FoodPostPrams {
    @ApiModelPropertyOptional() id: string;
    @ApiModelProperty() userId: string;
    @ApiModelProperty() title: string;
    @ApiModelPropertyOptional() description?: string;
    @ApiModelPropertyOptional() timeEstimate?: number;
    @ApiModelPropertyOptional() tagNames?: string[];
    @ApiModelPropertyOptional({ type: StepParam, isArray: true })
    steps?: Array<{
        no: number;
        content: string;
    }>;
    @ApiModelPropertyOptional({ type: IngredientDetailParam, isArray: true })
    ingredientDetails?: Array<{
        ingredientName: string;
        unit: string;
        quantity: number;
    }>;
    @ApiModelPropertyOptional() srcImages?: string[];
}
