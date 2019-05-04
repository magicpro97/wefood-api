import {
    Controller,
    Get,
    HttpStatus,
    HttpException,
    Query,
    Param,
    Body,
    Post,
    Put,
    Delete,
} from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { StepVm } from './models/view-models/step-vm.models';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';
import { StepService } from './step.service';
import { Step } from './models/step.model';
import { map } from 'lodash';
import { StepParams } from './models/view-models/step-params.model';

@Controller('step')
@ApiUseTags(Step.modelName)
export class StepController {
    constructor(private readonly stepService: StepService) {}

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: StepVm, isArray: true })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Step.modelName, 'GetAll'))
    async get(@Query('content') content: string): Promise<StepVm[]> {
        try {
            if (!content) {
                content = '';
            }

            const stepVms = await this.stepService.findAll({
                content: {
                    $regex: content,
                },
            });
            return this.stepService.map<StepVm[]>(
                map(stepVms, stepVm => stepVm.toJSON()),
            );
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: StepVm, isArray: true })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Step.modelName, 'GetById'))
    async getById(@Param('id') id: string): Promise<StepVm> {
        try {
            const exist = await this.stepService.findById(id);
            if (exist) {
                return exist.toJSON();
            } else {
                throw new HttpException(
                    `${id} is not exist`,
                    HttpStatus.NOT_FOUND,
                );
            }
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    @ApiResponse({ status: HttpStatus.CREATED, type: StepVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Step.modelName, 'Create'))
    async create(@Body() params: StepParams): Promise<StepParams> {
        const { content } = params;

        if (!content) {
            throw new HttpException(
                'Content is required',
                HttpStatus.BAD_REQUEST,
            );
        }
        try {
            const newStep = await this.stepService.createStep(params);
            return this.stepService.map<Step>(newStep);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    @ApiResponse({ status: HttpStatus.CREATED, type: StepVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Step.modelName, 'Update'))
    async update(@Body() params: StepVm): Promise<StepVm> {
        const { id, content } = params;

        if (!params || !id) {
            throw new HttpException(
                'Content is required',
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            const existingStep = await this.stepService.findById(id);
            if (!existingStep) {
                throw new HttpException(`${id} is not exist`, HttpStatus.BAD_REQUEST);
            }
            existingStep.content = content;
            const updatedStep = await this.stepService.update(id, existingStep);
            return this.stepService.map<StepVm>(updatedStep.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @ApiResponse({ status: HttpStatus.OK, type: StepVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Step.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<StepVm> {
        try {
            const exist = await this.stepService.findById(id);
            if (exist) {
                const deleted = await this.stepService.delete(id);
                return this.stepService.map<StepVm>(deleted.toJSON());
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
}
