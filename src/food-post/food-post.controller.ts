import {
    Controller,
    Get,
    HttpStatus,
    HttpException,
    Delete,
    Param,
    Post,
    Body,
    Put,
    Query,
} from '@nestjs/common';
import { FoodPostService } from './food-post.service';
import { FoodPostVm } from './models/view-models/food-post-vm.model';
import { FoodPost } from './models/food-post.model';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { map } from 'lodash';
import { GetOperationId } from '../shared/utilities/get-operation-id';
import { FoodPostPrams } from './models/view-models/food-post-params.model';
import { FoodTagService } from 'src/food-tag/food-tag.service';

@Controller('food-post')
@ApiUseTags(FoodPost.modelName)
export class FoodPostController {
    constructor(
        private readonly foodPostService: FoodPostService,
        private readonly foodTagService: FoodTagService,
    ) {}

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: FoodPostVm, isArray: true })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(FoodPost.modelName, 'GetAll'))
    async getAllFoodPost(
        @Query('userId') userId: string,
        @Query('title') title?: string,
        @Query('description') description?: string,
        @Query('timeEstimateFrom') timeEstimateFrom?: number,
        @Query('timeEstimateTo') timeEstimateTo?: number,
        @Query('foodTagIds') foodTagIds?: string[],
    ): Promise<FoodPostVm[]> {
        try {
            if (!userId) {
                userId = '';
            }
            if (!title) {
                title = '';
            }
            if (!description) {
                description = '';
            }
            if (!timeEstimateFrom) {
                timeEstimateFrom = 0;
            }
            if (!timeEstimateTo) {
                timeEstimateTo = Number.MAX_VALUE;
            }
            if (!foodTagIds) {
                const foodTag = await this.foodTagService.findAll();
                foodTagIds = foodTag.map(value => value.id);
            } else if (typeof foodTagIds === 'string') {
                foodTagIds = [foodTagIds];
            }
            const foodPosts = await this.foodPostService.findAll({
                userId: {
                    $regex: userId,
                },
                title: {
                    $regex: title,
                },
                description: {
                    $regex: description,
                },
                timeEstimate: {
                    $gte: timeEstimateFrom,
                    $lte: timeEstimateTo,
                },
                foodTagIds: {
                    $elemMatch: { $in: foodTagIds },
                },
            });
            return this.foodPostService.map<FoodPostVm[]>(
                map(foodPosts, foodPost => foodPost.toJSON()),
            );
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    @ApiResponse({ status: HttpStatus.OK, type: FoodPostVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(FoodPost.modelName, 'CreateNewFoodPost'))
    async createNewFoodPost(
        @Body() params: FoodPostPrams,
    ): Promise<FoodPostVm> {
        const { userId } = params;

        if (!userId) {
            throw new HttpException(
                'userId is required',
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            const newFoodPost = await this.foodPostService.createFoodPost(
                params,
            );
            return this.foodPostService.map<FoodPost>(newFoodPost);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    @ApiResponse({ status: HttpStatus.OK, type: FoodPostVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(FoodPost.modelName, 'CreateNewFoodPost'))
    async updateFoodPost(@Body() params: FoodPostVm): Promise<FoodPostVm> {
        const {
            id,
            userId,
            title,
            description,
            timeEstimate,
            foodTagIds,
            stepIds,
            ingredientDetailId,
            srcImages,
        } = params;

        if (!id) {
            throw new HttpException('id is required', HttpStatus.BAD_REQUEST);
        }

        if (!userId) {
            throw new HttpException(
                'userId is required',
                HttpStatus.BAD_REQUEST,
            );
        }

        const existFoodPost = await this.foodPostService.findById(id);
        if (!existFoodPost) {
            throw new HttpException(
                `${id} is not exist`,
                HttpStatus.BAD_REQUEST,
            );
        }
        existFoodPost.userId = userId;
        existFoodPost.title = title;
        existFoodPost.description = description;
        existFoodPost.timeEstimate = timeEstimate;
        existFoodPost.foodTagIds = foodTagIds;
        existFoodPost.stepIds = stepIds;
        existFoodPost.ingredientDetailId = ingredientDetailId;
        existFoodPost.srcImages = srcImages;

        const updatedFoodPost = await this.foodPostService.update(
            id,
            existFoodPost,
        );
        return this.foodPostService.map<FoodPostVm>(updatedFoodPost.toJSON());
    }

    @Delete(':id')
    @ApiResponse({ status: HttpStatus.OK, type: FoodPostVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(FoodPost.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<FoodPostVm> {
        try {
            const existFoodPost = await this.foodPostService.findById(id);
            if (existFoodPost) {
                const deletedFoodPost = await this.foodPostService.delete(id);
                return this.foodPostService.map<FoodPostVm>(
                    deletedFoodPost.toJSON(),
                );
            } else {
                throw new HttpException(
                    `${id} is not exist`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
