import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Ingredient } from './models/ingredient.model';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { unlink } from 'fs';
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
        const { ingredientName } = params;

        const newingredient = new this.model();

        newingredient.ingredientName = ingredientName;
        try {
            const result = await this.create(newingredient);
            return result.toJSON() as Ingredient;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteImageFile(path: string) {
        const imagePath = '.' + path.substring(path.indexOf('/'), path.length);
        unlink(imagePath, err => {
            if (err) {
                throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
