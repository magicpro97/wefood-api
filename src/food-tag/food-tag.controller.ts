import {
    Controller,
    Post,
    HttpStatus,
    Get,
    Put,
    Delete,
    Param,
    Body,
    HttpException,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { FoodTag } from './models/food-tag.model';
import { FoodTagService } from './food-tag/food-tag.service';
import { map, isArray } from 'lodash';
import { FoodTagVm } from './models/view-models/food-tag-vm.model';
import { FoodTagParams } from './models/view-models/food-tag-params.model';
import { GetOperationId } from 'src/shared/utilities/get-operation-id';

@Controller('food-tag')
@ApiUseTags(FoodTag.modelName)
export class FoodTagController {
    constructor(private readonly _foodTagService: FoodTagService) {}

    @Post()
    @ApiResponse({ status: HttpStatus.CREATED, type: FoodTagVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: FoodTagVm })
    @ApiOperation(GetOperationId(FoodTag.modelName, 'Create'))
    async create(@Body() params: FoodTagParams): Promise<FoodTagVm> {
        const { tagName } = params;

        if (!tagName) {
            throw new HttpException(
                'Content is required',
                HttpStatus.BAD_REQUEST,
            );
        }
        let exist;
        try {
            exist = await this._foodTagService.findOne({ tagName });
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (exist) {
            throw new HttpException(
                `${tagName} exists`,
                HttpStatus.BAD_REQUEST,
            );
        }
        try {
            const newFoodTag = await this._foodTagService.createFoodTag(params);
            return this._foodTagService.map<FoodTag>(newFoodTag);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: FoodTagVm, isArray: true })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: FoodTagVm })
    @ApiOperation(GetOperationId(FoodTag.modelName, 'GetAll'))
    async get(): Promise<FoodTagVm[]> {
        try {
            const foodTags = await this._foodTagService.findAll();
            return this._foodTagService.map<FoodTagVm[]>(
                map(foodTags, foodTag => foodTag.toJSON()),
            );
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    @ApiResponse({ status: HttpStatus.CREATED, type: FoodTagVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: FoodTagVm })
    @ApiOperation(GetOperationId(FoodTag.modelName, 'Update'))
    async update(@Body() vm: FoodTagVm): Promise<FoodTagVm> {
        const { id, tagName } = vm;

        if (!vm || !id) {
            throw new HttpException(
                'Missing parameters',
                HttpStatus.BAD_REQUEST,
            );
        }

        const exist = await this._foodTagService.findById(id);

        if (!exist) {
            throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
        }

        exist.tagName = tagName;

        try {
            const updated = await this._foodTagService.update(id, exist);
            return this._foodTagService.map<FoodTagVm>(updated.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @ApiResponse({ status: HttpStatus.OK, type: FoodTagVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: FoodTagVm })
    @ApiOperation(GetOperationId(FoodTag.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<FoodTagVm> {
        try {
            const deleted = await this._foodTagService.delete(id);
            return this._foodTagService.map<FoodTagVm>(deleted.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
