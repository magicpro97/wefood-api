import {
    Controller,
    Get,
    HttpStatus,
    Param,
    HttpException,
    Body,
    Post,
    Delete,
    Put,
} from '@nestjs/common';
import { IngredientDetail } from './models/ingredient-detail.models';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { IngredientDetailVm } from './models/view-models/ingredient-detail-vm.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';
import { IngredientDetailService } from './ingredient-detail.service';
import { IngredientDetailParams } from './models/view-models/ingredient-detail-params.model';
import { IngredientService } from '../ingredient/ingredient.service';
import { UnitService } from '../unit/unit.service';

@Controller('ingredient-detail')
@ApiUseTags(IngredientDetail.modelName)
export class IngredientDetailController {
    constructor(
        private readonly ingredientDetailService: IngredientDetailService,
        private readonly ingredientService: IngredientService,
        private readonly unitService: UnitService,
    ) {}

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: IngredientDetailVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(IngredientDetail.modelName, 'GetById'))
    async getById(@Param('id') id: string): Promise<IngredientDetailVm> {
        if (!id) {
            throw new HttpException('id is required', HttpStatus.BAD_REQUEST);
        }
        try {
            const existingIngredientDetail = await this.ingredientDetailService.findById(
                id,
            );
            if (!existingIngredientDetail) {
                throw new HttpException(
                    `${id} is not exist`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const ingredientDetailVm = new IngredientDetailVm();
            ingredientDetailVm.ingredient = await this.ingredientService.findById(
                existingIngredientDetail.ingredientId,
            );

            ingredientDetailVm.unit = await this.unitService.findById(
                existingIngredientDetail.unitId,
            );

            ingredientDetailVm.quantity = existingIngredientDetail.quantity;
            ingredientDetailVm.id = existingIngredientDetail.id;
            ingredientDetailVm.createAt = existingIngredientDetail.createAt;
            ingredientDetailVm.updateAt = existingIngredientDetail.updateAt;
            return ingredientDetailVm;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    @ApiResponse({ status: HttpStatus.OK, type: IngredientDetailVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(IngredientDetail.modelName, 'Create'))
    async create(
        @Body() params: IngredientDetailParams,
    ): Promise<IngredientDetailVm> {
        try {
            const { ingredientId, unitId, quantity } = params;
            if (!ingredientId) {
                throw new HttpException(
                    'ingredientId is required',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!unitId) {
                throw new HttpException(
                    'unitId is required',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!quantity) {
                throw new HttpException(
                    'quantity is required',
                    HttpStatus.BAD_REQUEST,
                );
            }
            const result = await this.ingredientDetailService.createIngredientDetail(
                params,
            );
            return this.ingredientDetailService.map<IngredientDetailVm>(result);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @ApiResponse({ status: HttpStatus.OK, type: IngredientDetailVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(IngredientDetail.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<IngredientDetailVm> {
        try {
            const exist = await this.ingredientDetailService.findById(id);
            if (exist) {
                const deleted = await this.ingredientDetailService.delete(id);
                return this.ingredientDetailService.map<IngredientDetailVm>(
                    deleted.toJSON(),
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

    @Put()
    @ApiResponse({ status: HttpStatus.OK, type: IngredientDetailVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(IngredientDetail.modelName, 'update'))
    async update(
        @Body() param: IngredientDetailParams,
    ): Promise<IngredientDetailVm> {
        const { id, quantity } = param;

        if (!param || !id) {
            throw new HttpException(
                'Missing parameters',
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            const existingIngredientDetail = await this.ingredientDetailService.findById(
                id,
            );

            if (!existingIngredientDetail) {
                throw new HttpException(
                    `${id} is not exist`,
                    HttpStatus.BAD_GATEWAY,
                );
            }

            if (quantity) {
                existingIngredientDetail.quantity = quantity;
            }

            const updated = await this.ingredientDetailService.updateIngredientDetail(
                param,
            );
            return this.ingredientDetailService.map<IngredientDetailVm>(
                updated,
            );
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
