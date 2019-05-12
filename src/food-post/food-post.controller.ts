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
    Inject,
    forwardRef,
} from '@nestjs/common';
import { FoodPostService } from './food-post.service';
import { FoodPostVm } from './models/view-models/food-post-vm.model';
import { FoodPost } from './models/food-post.model';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
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
        @Inject(forwardRef(() => FoodPostService))
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
        @Query('userId') userId?: string,
        @Query('title') title?: string,
        @Query('description') description?: string,
        @Query('timeEstimateFrom') timeEstimateFrom?: number,
        @Query('timeEstimateTo') timeEstimateTo?: number,
        @Query('tags') tags?: string[],
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
            let foodTagIds: string[] = [];
            if (tags) {
                if (typeof tags === 'string') {
                    const foodTag = await this.foodTagService.findOne({
                        tagName: tags,
                    });
                    foodTagIds.push(foodTag.id);
                } else {
                    const foodTags = await this.foodTagService.findAll({
                        tagName: {
                            $in: tags,
                        },
                    });
                    foodTagIds.concat(foodTags.map(value => value.id));
                }
            } else {
                const foodTags = await this.foodTagService.findAll();
                for (const foodTagId of foodTags.map(value => value.id)) {
                    foodTagIds.push(foodTagId);
                }
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

            const foodPostUserVms: FoodPostVm[] = [];
            for (const foodPost of foodPosts) {
                const foodPostUserVm = new FoodPostVm();

                foodPostUserVm.user = await this.userService.findById(
                    foodPost.userId,
                );
                foodPostUserVm.foodTags = [];
                for (const foodTagId of foodPost.foodTagIds) {
                    foodPostUserVm.foodTags.push(
                        await this.foodTagService.findById(foodTagId),
                    );
                }

                foodPostUserVm.createAt = foodPost.createAt;
                foodPostUserVm.updateAt = foodPost.updateAt;
                foodPostUserVm.description = foodPost.description;
                foodPostUserVm.srcImages = foodPost.srcImages;
                foodPostUserVm.title = foodPost.title;
                foodPostUserVm.timeEstimate = foodPost.timeEstimate;

                foodPostUserVm.steps = await this.stepService.findAll({
                    postId: foodPost.id,
                });

                foodPostUserVm.comments = await this.commentService.findAll({
                    postId: foodPost.id,
                });

                foodPostUserVm.ingredientDetails = [];
                const ingredientDetails = await this.ingredientDetailService.findAll(
                    {
                        postId: foodPost.id,
                    },
                );
                for (const ingredientDetail of ingredientDetails) {
                    const ingredientDetailVm = new IngredientDetailVm();
                    ingredientDetailVm.ingredient = await this.ingredientService.findById(
                        ingredientDetail.ingredientId,
                    );
                    ingredientDetailVm.unit = await this.unitService.findById(
                        ingredientDetail.unitId,
                    );
                    ingredientDetailVm.quantity = ingredientDetail.quantity;
                    foodPostUserVm.ingredientDetails.push(ingredientDetailVm);
                }

                foodPostUserVm.avgStar = foodPost.avgStar;
                foodPostUserVm.ratingCount = foodPost.ratingCount;

                foodPostUserVms.push(foodPostUserVm);
            }
            return foodPostUserVms;
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
                foodPostVm.user = await this.userService.findById(exist.userId);
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
                const ingredientDetails = await this.ingredientDetailService.findAll(
                    {
                        postId: exist.id,
                    },
                );
                const ingredientDetailVms: IngredientDetailVm[] = [];
                for (const ingredientDetail of ingredientDetails) {
                    const ingredientDetailVm = new IngredientDetailVm();
                    ingredientDetailVm.createAt = ingredientDetail.createAt;
                    ingredientDetailVm.updateAt = ingredientDetail.updateAt;
                    ingredientDetailVm.id = ingredientDetail.id;
                    ingredientDetailVm.postId = ingredientDetail.postId;
                    ingredientDetailVm.ingredient = await this.ingredientService.findById(
                        ingredientDetail.ingredientId,
                    );
                    ingredientDetailVm.unit = await this.unitService.findById(
                        ingredientDetail.unitId,
                    );
                    ingredientDetailVm.quantity = ingredientDetail.quantity;
                    ingredientDetailVms.push(ingredientDetailVm);
                }
                foodPostVm.ingredientDetails = ingredientDetailVms;

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

    @Get('suggestion/for-user/:userId')
    @ApiResponse({ status: HttpStatus.OK, type: FoodPostVm, isArray: true })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(FoodPost.modelName, 'GetSuggested'))
    async getSuggestedFoodPost(
        @Param('userId') userId: string,
    ): Promise<FoodPostVm[]> {
        if (!userId) {
            userId = '';
        }

        const existingUser = await this.userService.findById(userId);
        if (!existingUser) {
            throw new HttpException(
                `${userId} is not exist`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const foodPosts = await this.foodPostService.findRandomPost({
            foodTagIds: {
                $elemMatch: {
                    $in: existingUser.foodTags,
                },
            },
        });

        const foodPostUserVms: FoodPostVm[] = [];
        if (foodPosts.length > 0) {
            for (const foodPost of foodPosts) {
                const foodPostUserVm = new FoodPostVm();

                foodPostUserVm.user = await this.userService.findById(
                    foodPost.userId,
                );
                foodPostUserVm.foodTags = [];
                for (const foodTagId of foodPost.foodTagIds) {
                    foodPostUserVm.foodTags.push(
                        await this.foodTagService.findById(foodTagId),
                    );
                }

                foodPostUserVm.createAt = foodPost.createAt;
                foodPostUserVm.updateAt = foodPost.updateAt;
                foodPostUserVm.description = foodPost.description;
                foodPostUserVm.srcImages = foodPost.srcImages;
                foodPostUserVm.title = foodPost.title;
                foodPostUserVm.timeEstimate = foodPost.timeEstimate;

                foodPostUserVm.steps = await this.stepService.findAll({
                    postId: foodPost.id,
                });

                foodPostUserVm.comments = await this.commentService.findAll({
                    postId: foodPost.id,
                });

                foodPostUserVm.ingredientDetails = [];
                const ingredientDetails = await this.ingredientDetailService.findAll(
                    {
                        postId: foodPost.id,
                    },
                );
                for (const ingredientDetail of ingredientDetails) {
                    const ingredientDetailVm = new IngredientDetailVm();
                    ingredientDetailVm.ingredient = await this.ingredientService.findById(
                        ingredientDetail.ingredientId,
                    );
                    ingredientDetailVm.unit = await this.unitService.findById(
                        ingredientDetail.unitId,
                    );
                    ingredientDetailVm.quantity = ingredientDetail.quantity;
                    foodPostUserVm.ingredientDetails.push(ingredientDetailVm);
                }

                foodPostUserVm.avgStar = foodPost.avgStar;
                foodPostUserVm.ratingCount = foodPost.ratingCount;

                foodPostUserVms.push(foodPostUserVm);
            }
        }
        return foodPostUserVms;
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
                    const existingTag = await this.foodTagService.findOneAndUpdate(
                        {
                            tagName,
                        },
                        { tagName },
                    );
                    newTagIds.push(existingTag.id);
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

                newFoodPost.steps = newSteps;
            }
            if (ingredientDetails) {
                // Transform array of ingredientDetail to array of ingredient name
                const ingredientNames = ingredientDetails.map(
                    value => value.ingredientName,
                );

                // Check if ingredientName is exist to create it when it is not exist
                for (const ingredientName of ingredientNames) {
                    const exist = await this.ingredientService.findOneAndUpdate(
                        {
                            name: ingredientName,
                        },
                        { name: ingredientName, isApprove: false },
                    );

                    newIngredients.push(exist);
                }

                // Transform array of ingredientDetail to array of unique unit name
                const unitNames = [
                    ...new Set(ingredientDetails.map(item => item.unitName)),
                ];

                // Collect unit name form server
                const units = await this.unitService.findAll({
                    unitName: {
                        $in: unitNames,
                    },
                });

                for (let i = 0; i < ingredientDetails.length; i++) {
                    const newIngredientDetail = await this.ingredientDetailService.createIngredientDetail(
                        {
                            postId: newFoodPost.id,
                            ingredientId: newIngredients[i].id,
                            unitId: units.find(
                                unit =>
                                    unit.unitName ===
                                    ingredientDetails[i].unitName,
                            ).id,
                            quantity: ingredientDetails[i].quantity,
                        },
                    );
                    const ingredientDetailVm = new IngredientDetailVm();
                    ingredientDetailVm.createAt = newIngredientDetail.createAt;
                    ingredientDetailVm.updateAt = newIngredientDetail.updateAt;
                    ingredientDetailVm.id = newIngredientDetail.id;
                    ingredientDetailVm.postId = newIngredientDetail.postId;
                    ingredientDetailVm.ingredient = await this.ingredientService.findById(
                        newIngredientDetail.ingredientId,
                    );
                    ingredientDetailVm.unit = await this.unitService.findById(
                        newIngredientDetail.unitId,
                    );
                    ingredientDetailVm.quantity = newIngredientDetail.quantity;

                    newIngredientDetails.push(ingredientDetailVm);
                }

                newFoodPost.ingredientDetails = newIngredientDetails;
            }
            newFoodPost.foodTags = await this.foodTagService.findAll({
                tagName: {
                    $in: tagNames,
                },
            });
            newFoodPost.user = await this.userService.findById(userId);

            newFoodPost.comments = await this.commentService.findAll({
                postId: newFoodPost.id,
            });
            newFoodPost.avgStar = 0;
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
                const existingTag = await this.foodTagService.findOneAndUpdate(
                    {
                        tagName,
                    },
                    { tagName },
                );
                newTagIds.push(existingTag.id);
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

            // Transform array of ingredientDetail to array of ingredient name
            const ingredientNames = ingredientDetails.map(
                value => value.ingredientName,
            );

            // Check if ingredientName is exist to create it when it is not exist
            for (const ingredientName of ingredientNames) {
                const exist = await this.ingredientService.findOneAndUpdate(
                    {
                        name: ingredientName,
                    },
                    { name: ingredientName, isApprove: false },
                );

                newIngredients.push(exist);
            }

            // Transform array of ingredientDetail to array of unit name
            const unitNames = ingredientDetails.map(item => item.unitName);

            // Collect unit name form server
            const units = await this.unitService.findAll({
                unitName: {
                    $in: unitNames,
                },
            });

            // unitIds <- unitNames + units
            const newUnitNames = unitNames.reduce((current, value) => {
                current[value] = true;
                return current;
            }, {});
            const unitIds = units.filter(value => newUnitNames[value.unitName]);

            for (let i = 0; i < ingredientDetails.length; i++) {
                const newIngredientDetail = await this.ingredientDetailService.createIngredientDetail(
                    {
                        postId: updatedFoodPostVm.id,
                        ingredientId: newIngredients[i].id,
                        unitId: unitIds[i].id,
                        quantity: ingredientDetails[i].quantity,
                    },
                );
                const ingredientDetailVm = new IngredientDetailVm();
                ingredientDetailVm.createAt = newIngredientDetail.createAt;
                ingredientDetailVm.updateAt = newIngredientDetail.updateAt;
                ingredientDetailVm.id = newIngredientDetail.id;
                ingredientDetailVm.postId = newIngredientDetail.postId;
                ingredientDetailVm.ingredient = await this.ingredientService.findById(
                    newIngredientDetail.ingredientId,
                );
                ingredientDetailVm.unit = await this.unitService.findById(
                    newIngredientDetail.unitId,
                );
                ingredientDetailVm.quantity = newIngredientDetail.quantity;

                newIngredientDetails.push(ingredientDetailVm);
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
            let avgStar = 0;
            for (const rating of ratings) {
                avgStar += rating.star;
            }
            avgStar = avgStar / ratings.length;
            updatedFoodPostVm.avgStar = avgStar;
        } else {
            updatedFoodPostVm.avgStar = 0;
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

    @Get('trending/post')
    @ApiResponse({ status: HttpStatus.OK, type: FoodPostVm, isArray: true })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(FoodPost.modelName, 'GetTrending'))
    async getTrending(): Promise<FoodPostVm[]> {
        const today = new Date();
        today.setDate(today.getDate() - 7);
        const foodPosts = await this.foodPostService.findTrendingPost({
            createAt: {
                $gte: today,
            },
            ratingCount: {
                $gt: 0,
            },
        });
        const foodPostVms: FoodPostVm[] = [];
        for (const foodPost of foodPosts) {
            const foodPostVm = new FoodPostVm();
            foodPostVm.avgStar = foodPost.avgStar;
            foodPostVm.createAt = foodPost.createAt;
            foodPostVm.description = foodPost.description;
            foodPostVm.updateAt = foodPost.updateAt;
            foodPostVm.srcImages = foodPost.srcImages;
            foodPostVm.ratingCount = foodPost.ratingCount;
            foodPostVm.timeEstimate = foodPost.timeEstimate;
            foodPostVm.title = foodPost.title;
            foodPostVm.user = await this.userService.findById(foodPost.userId);
            foodPostVm.comments = await this.commentService.findAll({
                postId: foodPost.id,
            });
            foodPostVm.steps = await this.stepService.findAll({
                postId: foodPost.id,
            });

            const ingredientDetails = await this.ingredientDetailService.findAll(
                { postId: foodPost.id },
            );
            const ingredientDetailVms: IngredientDetailVm[] = [];
            for (const ingredientDetail of ingredientDetails) {
                const ingredientDetailVm = new IngredientDetailVm();
                ingredientDetailVm.createAt = ingredientDetail.createAt;
                ingredientDetailVm.updateAt = ingredientDetail.updateAt;
                ingredientDetailVm.id = ingredientDetail.id;
                ingredientDetailVm.postId = ingredientDetail.postId;
                ingredientDetailVm.ingredient = await this.ingredientService.findById(
                    ingredientDetail.ingredientId,
                );
                ingredientDetailVm.unit = await this.unitService.findById(
                    ingredientDetail.unitId,
                );
                ingredientDetailVm.quantity = ingredientDetail.quantity;
                ingredientDetailVms.push(ingredientDetailVm);
            }
            foodPostVm.ingredientDetails = ingredientDetailVms;
            foodPostVms.push(foodPostVm);
        }
        return foodPostVms;
    }
}
