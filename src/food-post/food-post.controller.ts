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
import { FoodTagService } from '../food-tag/food-tag.service';
import { StepService } from '../step/step.service';
import { UserService } from '../user/user.service';
import { UnitService } from '../unit/unit.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { IngredientDetailService } from '../ingredient-detail/ingredient-detail.service';
import { CommentService } from '../comment/comment.service';
import { StepVm } from '../step/models/view-models/step-vm.models';
import { IngredientDetailVm } from '../ingredient-detail/models/view-models/ingredient-detail-vm.model';
import { IngredientVm } from '../ingredient/models/view-models/ingredient-vm.model';
import { RatingService } from '../rating/rating.service';

@Controller('food-post')
@ApiUseTags(FoodPost.modelName)
export class FoodPostController {
    constructor(
        private readonly commentService: CommentService,
        private readonly ingredientDetailService: IngredientDetailService,
        private readonly ingredientService: IngredientService,
        private readonly foodPostService: FoodPostService,
        private readonly foodTagService: FoodTagService,
        private readonly stepService: StepService,
        private readonly userService: UserService,
        private readonly unitService: UnitService,
        private readonly ratingService: RatingService,
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

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: FoodPostVm, isArray: true })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(FoodPost.modelName, 'GetById'))
    async getByIdFoodPost(@Param('id') id: string): Promise<FoodPostVm[]> {
        try {
            const exist = await this.foodPostService.findById(id);
            if (!exist) {
                throw new HttpException(
                    `${id} is not exist`,
                    HttpStatus.BAD_REQUEST,
                );
            } else {
                const foodPostVm = new FoodPostVm();
                foodPostVm.createAt = exist.createAt;
                foodPostVm.updateAt = exist.updateAt;
                foodPostVm.id = id;
                foodPostVm.userId = exist.userId;
                foodPostVm.title = exist.title;
                foodPostVm.description = exist.description;
                foodPostVm.timeEstimate = exist.timeEstimate;
                foodPostVm.foodTags = [];
                for (const foodTagId of exist.foodTagIds) {
                    foodPostVm.foodTags.push(
                        await this.foodTagService.findById(foodTagId),
                    );
                }
                foodPostVm.steps = await this.stepService.findAll({
                    postId: exist.id,
                });
                foodPostVm.ingredientDetails = await this.ingredientDetailService.findAll(
                    {
                        postId: exist.id,
                    },
                );
                foodPostVm.comments = await this.commentService.findAll({
                    postId: exist.id,
                });
                foodPostVm.srcImages = exist.srcImages;
                return this.foodPostService.map<FoodPostVm[]>(foodPostVm);
            }
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
        const {
            userId,
            tagNames,
            ingredientDetails,
            steps,
            title,
            timeEstimate,
            description,
            srcImages,
        } = params;
        const newSteps: StepVm[] = [];
        const newTagIds: string[] = [];
        const newIngredients: IngredientVm[] = [];
        const newIngredientDetails: IngredientDetailVm[] = [];

        if (!userId) {
            throw new HttpException(
                'userId is required',
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            const existingUser = await this.userService.findById(userId);
            if (!existingUser) {
                throw new HttpException(
                    `${userId} is not exist`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (tagNames) {
                for (const tagName of tagNames) {
                    const existingTag = await this.foodTagService.findOne({
                        tagName,
                    });
                    if (!existingTag) {
                        const newTag = await this.foodTagService.createFoodTag({
                            tagName,
                        });
                        newTagIds.push(newTag.id);
                    } else {
                        newTagIds.push(existingTag.id);
                    }
                }
            }
            const newFoodPost = await this.foodPostService.createFoodPost({
                userId,
                title,
                description,
                timeEstimate,
                foodTagIds: newTagIds,
                srcImages,
            });
            if (steps) {
                for (const step of steps) {
                    const newStep = await this.stepService.createStep({
                        postId: newFoodPost.id,
                        no: step.no,
                        content: step.content,
                    });

                    newSteps.push(newStep);
                }
            }
            if (ingredientDetails) {
                const ingredientNames = ingredientDetails.map(
                    value => value.ingredientName,
                );
                for (const ingredientName of ingredientNames) {
                    const exist = await this.ingredientService.findOne({
                        name: ingredientName,
                    });
                    if (!exist) {
                        const newIngredient = await this.ingredientService.createIngredient(
                            {
                                name,
                                isApproved: false,
                            },
                        );
                        newIngredients.push(newIngredient);
                    } else {
                        newIngredients.push(exist);
                    }
                }

                const units = await this.unitService.findAll({
                    unitName: {
                        $in: ingredientDetails.map(item => item.unit),
                    },
                });
                const unitIds = units.map(unit => unit.id);

                for (let i = 0; i < ingredientDetails.length; i++) {
                    const newIngredientDetail = await this.ingredientDetailService.createIngredientDetail(
                        {
                            postId: newFoodPost.id,
                            ingredientId: newIngredients[i].id,
                            unitId: unitIds[i],
                            quantity: ingredientDetails[i].quantity,
                        },
                    );
                    newIngredientDetails.push(newIngredientDetail);
                }
            }
            newFoodPost.foodTags = await this.foodTagService.findAll({
                tagName: {
                    $in: tagNames,
                },
            });
            newFoodPost.ingredientDetails = newIngredientDetails;
            newFoodPost.steps = newSteps;
            newFoodPost.comments = await this.commentService.findAll({
                postId: newFoodPost.id,
            });
            newFoodPost.star = 0;
            return this.foodPostService.map<FoodPostVm>(newFoodPost);
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
    @ApiOperation(GetOperationId(FoodPost.modelName, 'UpdateFoodPost'))
    async updateFoodPost(@Body() params: FoodPostPrams): Promise<FoodPostVm> {
        const {
            id,
            userId,
            title,
            description,
            timeEstimate,
            tagNames,
            steps,
            ingredientDetails,
            srcImages,
        } = params;
        const newSteps: StepVm[] = [];
        const newTagIds: string[] = [];
        const newIngredients: IngredientVm[] = [];
        const newIngredientDetails: IngredientDetailVm[] = [];
        const updatedFoodPostVm = new FoodPostVm();

        if (!id) {
            throw new HttpException('id is required', HttpStatus.BAD_REQUEST);
        }

        if (!userId) {
            throw new HttpException(
                'userId is required',
                HttpStatus.BAD_REQUEST,
            );
        }

        const existingUser = await this.userService.findById(userId);
        if (!existingUser) {
            throw new HttpException(
                `${userId} is not exist`,
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
        existFoodPost.srcImages = srcImages;

        if (tagNames) {
            for (const tagName of tagNames) {
                const existingTag = await this.foodTagService.findOne({
                    tagName,
                });
                if (!existingTag) {
                    const newTag = await this.foodTagService.createFoodTag({
                        tagName,
                    });
                    newTagIds.push(newTag.id);
                } else {
                    newTagIds.push(existingTag.id);
                }
            }
            updatedFoodPostVm.foodTags = await this.foodTagService.findAll({
                tagName: {
                    $in: tagNames,
                },
            });
            existFoodPost.foodTagIds = newTagIds;
        }
        if (steps) {
            this.stepService.deleteAll({ postId: id });
            for (const step of steps) {
                const newStep = await this.stepService.createStep({
                    postId: id,
                    no: step.no,
                    content: step.content,
                });
                newSteps.push(newStep);
            }
            updatedFoodPostVm.steps = newSteps;
        }
        if (ingredientDetails) {
            this.ingredientDetailService.deleteAll({ postId: id });
            const ingredientNames = ingredientDetails.map(
                value => value.ingredientName,
            );
            for (const ingredientName of ingredientNames) {
                const exist = await this.ingredientService.findOne({
                    name: ingredientName,
                });
                if (!exist) {
                    const newIngredient = await this.ingredientService.createIngredient(
                        {
                            name,
                            isApproved: false,
                        },
                    );
                    newIngredients.push(newIngredient);
                } else {
                    newIngredients.push(exist);
                }
            }

            const units = await this.unitService.findAll({
                unitName: {
                    $in: ingredientDetails.map(item => item.unit),
                },
            });
            const unitIds = units.map(unit => unit.id);

            for (let i = 0; i < ingredientDetails.length; i++) {
                const newIngredientDetail = await this.ingredientDetailService.createIngredientDetail(
                    {
                        postId: id,
                        ingredientId: newIngredients[i].id,
                        unitId: unitIds[i],
                        quantity: ingredientDetails[i].quantity,
                    },
                );
                newIngredientDetails.push(newIngredientDetail);
            }
            updatedFoodPostVm.ingredientDetails = newIngredientDetails;
        }
        updatedFoodPostVm.comments = await this.commentService.findAll({
            postId: id,
        });
        const ratings = await this.ratingService.findAll({
            postId: id,
        });
        if (ratings.length > 0) {
            let startAvg = 0;
            for (const rating of ratings) {
                startAvg += rating.star;
            }
            startAvg = startAvg / ratings.length;
            updatedFoodPostVm.star = startAvg;
        } else {
            updatedFoodPostVm.star = 0;
        }
        await this.foodPostService.update(id, existFoodPost);
        return this.foodPostService.map<FoodPostVm>(updatedFoodPostVm);
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