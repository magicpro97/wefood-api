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
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Ingredient } from './models/ingredient.model';
import { IngredientService } from './ingredient.service';
import { IngredientVm } from './models/view-models/ingredient-vm.model';
import { IngredientParams } from './models/view-models/ingredient-params.model';
import { ApiException } from 'src/shared/api-exception.model';
import { GetOperationId } from 'src/shared/utilities/get-operation-id';
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
        const { ingredientName } = params;

        if (!ingredientName) {
            throw new HttpException(
                'Ingredient is required',
                HttpStatus.BAD_REQUEST,
            );
        }
        let exist;
        try {
            exist = await this.ingredientService.findOne({ingredientName});
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (exist) {
            throw new HttpException(
                `${ingredientName} exists`,
                HttpStatus.BAD_REQUEST,
            );
        }
        try {
            const newIngredient = await this.ingredientService.createIngredient(params);
            return this.ingredientService.map<Ingredient>(newIngredient);
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
    @ApiOperation(GetOperationId(Ingredient.modelName, 'GetAll'))
    async get(): Promise<IngredientVm[]> {
        try {
            const ingredients = await this.ingredientService.findAll();
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
                    'Ingredient is not exist',
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
    async update(@Body() vm: IngredientVm): Promise<IngredientVm> {
        const { id, ingredientName } = vm;

        if (!vm || !id) {
            throw new HttpException(
                'Missing parameters',
                HttpStatus.BAD_REQUEST,
            );
        }

        const exist = await this.ingredientService.findById(id);

        if (!exist) {
            throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
        }
        exist.ingredientName = ingredientName;
        try {
            const updated = await this.ingredientService.update(id, exist);
            return this.ingredientService.map<IngredientVm>(updated.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
