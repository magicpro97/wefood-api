import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class UnitParams {
    @ApiModelProperty() unitName: string;
}
