import {
    Controller,
    Get,
    HttpStatus,
    HttpException,
    Query,
    Post,
    Body,
    Put,
    Param,
    Delete,
} from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { RatingVm } from './models/view-models/rating-vm.models';
import { ApiException } from 'src/shared/api-exception.model';
import { GetOperationId } from 'src/shared/utilities/get-operation-id';
import { Rating } from './models/rating.model';
import { RatingService } from './rating.service';
import { map } from 'lodash';
import { RatingParams } from './models/view-models/rating-params.models';
import { UserService } from 'src/user/user.service';

@Controller('rating')
export class RatingController {
    constructor(
        private readonly ratingService: RatingService,
        private readonly userService: UserService,
    ) {}

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: RatingVm, isArray: true })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        type: ApiException,
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Rating.modelName, 'GetAll'))
    async get(
        @Query('starStart') starStart: number,
        @Query('starEnd') starEnd: number,
    ): Promise<RatingVm[]> {
        try {
            if (starStart > starEnd) {
                throw new HttpException(
                    'startStart is not greater than starEnd',
                    HttpStatus.BAD_REQUEST,
                );
            }
            if (!starStart) {
                starStart = 0;
            }
            if (!starEnd) {
                starEnd = 5;
            }
            const ratings = await this.ratingService.findAll({
                star: { $gte: starStart, $lte: starEnd },
            });
            return this.ratingService.map<RatingVm[]>(
                map(ratings, rating => rating.toJSON()),
            );
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    @ApiResponse({ status: HttpStatus.CREATED, type: RatingVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Rating.modelName, 'Create'))
    async create(@Body() params: RatingParams): Promise<RatingVm> {
        const { userId, postId, star } = params;

        if (!params) {
            throw new HttpException(
                'Rating params is required',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!userId) {
            throw new HttpException(
                'userId is required',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!postId) {
            throw new HttpException(
                'postId is required',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!star) {
            throw new HttpException('star is required', HttpStatus.BAD_REQUEST);
        }

        try {
            const existingUser = await this.userService.findById(userId);
            if (!existingUser) {
                throw new HttpException(
                    `${userId} is not exists`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try {
            const newRating = await this.ratingService.createFoodTag(params);
            return this.ratingService.map<Rating>(newRating);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    @ApiResponse({ status: HttpStatus.CREATED, type: RatingVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Rating.modelName, 'Update'))
    async update(@Body() vm: RatingVm): Promise<RatingVm> {
        const { id, userId, postId, star } = vm;

        if (!vm || !id) {
            throw new HttpException(
                'Missing parameters',
                HttpStatus.BAD_REQUEST,
            );
        }

        const exist = await this.ratingService.findById(id);

        if (!exist) {
            throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
        }

        if (userId) {
            exist.userId = userId;
        }

        if (postId) {
            exist.postId = postId;
        }

        if (star) {
            exist.star = star;
        }

        try {
            const updated = await this.ratingService.update(id, exist);
            return this.ratingService.map<RatingVm>(updated.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @ApiResponse({ status: HttpStatus.OK, type: RatingVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Rating.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<RatingVm> {
        try {
            const exist = await this.ratingService.findById(id);
            if (exist) {
                const deleted = await this.ratingService.delete(id);
                return this.ratingService.map<RatingVm>(deleted.toJSON());
            } else {
                throw new HttpException(
                    'Rating is not exist',
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}