import { BaseModelVm } from '../../../shared/base.model-vm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { FoodTagVm } from '../../../food-tag/models/view-models/food-tag-vm.model';
import { StepVm } from '../../../step/models/view-models/step-vm.models';
import { IngredientDetailVm } from '../../../ingredient-detail/models/view-models/ingredient-detail-vm.model';
import { CommentVm } from '../../../comment/models/view-models/comment-vm.model';
import { UserVm } from '../../../user/models/view-models/user-vm.model';

export class FoodPostVm extends BaseModelVm {
    @ApiModelProperty() user: UserVm;
    @ApiModelProperty() title: string;
    @ApiModelPropertyOptional() description?: string;
    @ApiModelPropertyOptional() timeEstimate?: number;
    @ApiModelPropertyOptional() foodTags?: FoodTagVm[];
    @ApiModelPropertyOptional() steps?: StepVm[];
    @ApiModelPropertyOptional() ingredientDetails?: IngredientDetailVm[];
    @ApiModelPropertyOptional() comments?: CommentVm[];
    @ApiModelPropertyOptional() avgStar?: number;
    @ApiModelPropertyOptional() ratingCount?: number;
    @ApiModelPropertyOptional() srcImages?: string[];
}
