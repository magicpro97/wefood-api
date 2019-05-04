import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Ingredient } from './models/ingredient.model';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { IngredientParams } from './models/view-models/ingredient-params.model';
@Injectable()
export class IngredientService extends BaseService<Ingredient> {
    constructor(
        @InjectModel(Ingredient.modelName)
        private readonly ingredientModel: ModelType<Ingredient>,
        private readonly mapperService: MapperService,
    ) {
        super();
        this.model = ingredientModel;
        this.mapper = mapperService.mapper;
    }

    async createIngredient(params: IngredientParams): Promise<Ingredient> {
        const { name, unitId, srcImage } = params;

        const newIngredient = new this.model();

        newIngredient.name = name;
        newIngredient.unitId = unitId;
        newIngredient.srcImage = srcImage;
        try {
            const result = await this.create(newIngredient);
            return result.toJSON() as Ingredient;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
