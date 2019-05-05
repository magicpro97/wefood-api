import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Ingredient } from './models/ingredient.model';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { IngredientParams } from './models/view-models/ingredient-params.model';
import { IngredientVm } from './models/view-models/ingredient-vm.model';

@Injectable()
export class IngredientService extends BaseService<Ingredient> {
    async updateIngredient(vm: IngredientVm): Promise<Ingredient> {
        const { name, srcImage } = vm;
        const existingIngredient = await this.findById(vm.id);

        if (name) {
            existingIngredient.name = name;
        }

        if (srcImage) {
            existingIngredient.srcImage = srcImage;
        }
        const updated = await this.update(vm.id, existingIngredient);
        return updated.toJSON() as Ingredient;
    }

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
        const { name, srcImage, isApproved } = params;
        const newIngredient = new this.model();
        console.log(1);
        newIngredient.name = name;
        if (srcImage) {
            newIngredient.srcImage = srcImage;
        }
        newIngredient.isApproved = isApproved;
        try {
            const result = await this.create(newIngredient);
            return result.toJSON() as Ingredient;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
