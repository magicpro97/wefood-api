import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class IngredientParams {
    @ApiModelProperty() name: string;
    @ApiModelProperty() isApproved?: boolean;
    @ApiModelPropertyOptional() srcImage?: string;
}
