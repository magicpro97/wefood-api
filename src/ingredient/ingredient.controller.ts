import {
    Controller,
    Post,
    HttpStatus,
    Body,
    HttpException,
    Get,
    Delete,
    Param,
    Put,
    Query,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Ingredient } from './models/ingredient.model';
import { IngredientService } from './ingredient.service';
import { IngredientVm } from './models/view-models/ingredient-vm.model';
import { IngredientParams } from './models/view-models/ingredient-params.model';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';
import { map } from 'lodash';

@Controller('ingredient')
@ApiUseTags(Ingredient.modelName)
export class IngredientController {
    constructor(private readonly ingredientService: IngredientService) {}

    @Post()
    @ApiResponse({ status: HttpStatus.CREATED, type: IngredientVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Ingredient.modelName, 'Create'))
    async create(@Body() params: IngredientParams): Promise<IngredientVm> {
        const { name } = params;

        if (!name) {
            throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
        }

        try {
            const existingIngredient = await this.ingredientService.findOne({
                name,
            });
            if (existingIngredient) {
                throw new HttpException(
                    `${name} exists`,
                    HttpStatus.BAD_REQUEST,
                );
            }
            params.name = name;
            const newIngredient = await this.ingredientService.createIngredient(
                params,
            );
            return this.ingredientService.map<Ingredient>(newIngredient);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: IngredientVm, isArray: true })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Ingredient.modelName, 'GetById'))
    async getById(@Param('id') id: string): Promise<IngredientVm> {
        try {
            const exist = await this.ingredientService.findById(id);
            if (exist) {
                return this.ingredientService.map<IngredientVm>(exist.toJSON());
            } else {
                throw new HttpException(
                    `${id} is not exists`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: IngredientVm, isArray: true })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Ingredient.modelName, 'GetOne'))
    async getByName(
        @Query('name') name: string,
        @Query('isApproved') isApproved: any,
    ): Promise<IngredientVm[]> {
        try {
            if (!name) {
                name = '';
            }
            let ingredients: Array<InstanceType<any>>;
            if (isApproved) {
                if (isApproved === 'true') {
                    isApproved = true;
                } else {
                    isApproved = false;
                }
                ingredients = await this.ingredientService.findAll({
                    name: { $regex: name },
                    isApproved,
                });
            } else {
                ingredients = await this.ingredientService.findAll({
                    name: { $regex: name },
                });
            }

            return this.ingredientService.map<IngredientVm[]>(
                map(ingredients, ingredient => ingredient.toJSON()),
            );
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @ApiResponse({ status: HttpStatus.OK, type: IngredientVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Ingredient.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<IngredientVm> {
        try {
            const exist = await this.ingredientService.findById(id);
            if (exist) {
                const deleted = await this.ingredientService.delete(id);
                return this.ingredientService.map<IngredientVm>(
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
    @ApiResponse({ status: HttpStatus.OK, type: IngredientVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Ingredient.modelName, 'update'))
    async update(@Body() params: IngredientParams): Promise<IngredientVm> {
        const { id } = params;
        try {
            if (!params || !id) {
                throw new HttpException(
                    'Missing parameters',
                    HttpStatus.BAD_REQUEST,
                );
            }
            const existingIngredient = await this.ingredientService.findById(
                id,
            );
            if (!existingIngredient) {
                throw new HttpException(
                    `${id} Not found`,
                    HttpStatus.NOT_FOUND,
                );
            }

            const updated = await this.ingredientService.updateIngredient(
                params,
            );
            return this.ingredientService.map<IngredientVm>(updated);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
