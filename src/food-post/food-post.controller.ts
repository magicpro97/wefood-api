import {
    Controller,
    Get,
    HttpStatus,
    HttpException,
    Delete,
    Param,
} from '@nestjs/common';
import { FoodPostService } from './food-post.service';
import { FoodPostVm } from './models/view-models/food-post-vm.model';
import { FoodPost } from './models/food-post.model';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { map } from 'lodash';
import { GetOperationId } from '../shared/utilities/get-operation-id';

@Controller('food-post')
@ApiUseTags(FoodPost.modelName)
export class FoodPostController {
    constructor(private readonly foodPostService: FoodPostService) {}

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: FoodPostVm, isArray: true })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(FoodPost.modelName, 'GetAll'))
    async getAllFoodPost(): Promise<FoodPostVm[]> {
        try {
            const foodPosts = await this.foodPostService.findAll();
            if (typeof foodPosts !== 'undefined' && foodPosts.length > 0) {
                return this.foodPostService.map<FoodPostVm[]>(
                    map(foodPosts, foodPost => foodPost.toJSON()),
                );
            } else {
                throw new HttpException(
                    'FoodPost is not exist!',
                    HttpStatus.BAD_GATEWAY,
                );
            }
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
        return;
    }
}
