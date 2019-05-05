import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class FoodPostPrams {
    @ApiModelPropertyOptional() id: string;
    @ApiModelProperty() userId: string;
    @ApiModelProperty() title: string;
    @ApiModelPropertyOptional() description?: string;
    @ApiModelPropertyOptional() timeEstimate?: number;
    @ApiModelPropertyOptional() tagNames?: string[];
    @ApiModelPropertyOptional() steps?: Array<{
        no: number;
        content: string;
    }>;
    @ApiModelPropertyOptional() ingredientDetails?: Array<{
        ingredientName: string;
        unit: string;
        quantity: number;
    }>;
    @ApiModelPropertyOptional() srcImages?: string[];
}
