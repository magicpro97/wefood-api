import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from 'src/shared/base.service';
import { Unit } from './models/unit.model';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from 'src/shared/mapper/mapper.service';
import { UnitParams } from './models/view-models/unit-params.model';

@Injectable()
export class UnitService extends BaseService<Unit> {
    constructor(
        @InjectModel(Unit.modelName)
        private readonly unitModel: ModelType<Unit>,
        private readonly mapperService: MapperService,
    ) {
        super();
        this.model = unitModel;
        this.mapper = mapperService.mapper;
    }

    async createUnit(params: UnitParams): Promise<Unit> {
        const { unitName } = params;

        const newUnit = new this.model();

        newUnit.unitName = unitName;
        try {
            const result = await this.create(newUnit);
            return result.toJSON() as Unit;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
