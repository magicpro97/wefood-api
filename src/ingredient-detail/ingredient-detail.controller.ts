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
import { ApiException } from 'src/shared/api-exception.model';
import { IngredientDetailVm } from './models/view-models/ingredient-detail-vm.model';
import { GetOperationId } from 'src/shared/utilities/get-operation-id';
import { IngredientDetailService } from './ingredient-detail.service';
import { IngredientDetailParams } from './models/view-models/ingredient-detail-params.model';
import { IngredientService } from 'src/ingredient/ingredient.service';

@Controller('ingredient-detail')
@ApiUseTags(IngredientDetail.modelName)
export class IngredientDetailController {
    constructor(
        private readonly ingredientDetailService: IngredientDetailService,
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
            return this.ingredientDetailService.map<IngredientDetailVm>(
                existingIngredientDetail.toJSON(),
            );
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
            const { ingredientId } = params;
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
    async update(@Body() vm: IngredientDetailVm): Promise<IngredientDetailVm> {
        const { id, ingredientId, quantity } = vm;

        if (!vm || !id) {
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
                vm,
            );
            return this.ingredientDetailService.map<IngredientDetailVm>(
                updated,
            );
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
