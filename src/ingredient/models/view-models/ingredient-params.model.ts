import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class IngredientParams {
    @ApiModelPropertyOptional({ description: 'Only use for PUT method' })
    id?: string;
    @ApiModelProperty() name: string;
    @ApiModelProperty() isApproved?: boolean;
    @ApiModelPropertyOptional() srcImage?: string;
}
