import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Step } from './models/step.model';
import { StepParams } from './models/view-models/step-params.model';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StepService extends BaseService<Step> {
    constructor(
        @InjectModel(Step.modelName)
        private readonly stepModel: ModelType<Step>,
        private readonly mapperService: MapperService,
    ) {
        super();
        this.model = stepModel;
        this.mapper = mapperService.mapper;
    }

    async createStep(params: StepParams): Promise<Step> {
        const newStep = new this.model();
        newStep.content = params.content;
        try {
            const result = await this.create(newStep);
            return result.toJSON() as Step;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
