import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { IngredientDetail } from './models/ingredient-detail.models';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { IngredientDetailParams } from './models/view-models/ingredient-detail-params.model';
import { IngredientDetailVm } from './models/view-models/ingredient-detail-vm.model';

@Injectable()
export class IngredientDetailService extends BaseService<IngredientDetail> {
    async updateIngredientDetail(vm: IngredientDetailVm) {
        const { id, ingredientId, quantity, postId } = vm;
        const existingIngredientDetail = await this.findById(id);

        if (postId) {
            existingIngredientDetail.postId = postId;
        } else {
            throw new HttpException(
                'postId is requred!',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (ingredientId) {
            existingIngredientDetail.ingredientId = ingredientId;
        } else {
            throw new HttpException(
                'ingredientId is requred!',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (quantity) {
            existingIngredientDetail.quantity = quantity;
        } else {
            throw new HttpException(
                'quantity is requred!',
                HttpStatus.BAD_REQUEST,
            );
        }
        const updated = await this.update(id, existingIngredientDetail);
        return updated.toJSON() as IngredientDetail;
    }

    constructor(
        @InjectModel(IngredientDetail.modelName)
        private readonly ingredientDetailModel: ModelType<IngredientDetail>,
        private readonly mapperService: MapperService,
    ) {
        super();
        this.model = ingredientDetailModel;
        this.mapper = mapperService.mapper;
    }

    async createIngredientDetail(
        params: IngredientDetailParams,
    ): Promise<IngredientDetail> {
        const { ingredientId, unitId, quantity, postId } = params;
        const newIngredientDetail = new this.model();

        newIngredientDetail.postId = postId;
        newIngredientDetail.ingredientId = ingredientId;
        newIngredientDetail.unitId = unitId;
        newIngredientDetail.quantity = quantity;
        try {
            const result = await this.create(newIngredientDetail);
            return result.toJSON() as IngredientDetail;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
