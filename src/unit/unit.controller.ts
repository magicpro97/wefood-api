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
import { Unit } from './models/unit.model';
import { UnitService } from './unit.service';
import { UnitVm } from './models/view-models/unit-vm.model';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';
import { UnitParams } from './models/view-models/unit-params.model';
import { map } from 'lodash';

@Controller('unit')
@ApiUseTags(Unit.modelName)
export class UnitController {
    constructor(private readonly unitService: UnitService) {}

    @Post()
    @ApiResponse({ status: HttpStatus.CREATED, type: UnitVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Unit.modelName, 'Create'))
    async create(@Body() params: UnitParams): Promise<UnitVm> {
        const { unitName } = params;

        if (!unitName) {
            throw new HttpException(
                'Content is required',
                HttpStatus.BAD_REQUEST,
            );
        }
        let exist;
        try {
            exist = await this.unitService.findOne({ unitName });
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (exist) {
            throw new HttpException(
                `${unitName} exists`,
                HttpStatus.BAD_REQUEST,
            );
        }
        try {
            const newUnit = await this.unitService.createUnit(params);
            return this.unitService.map<Unit>(newUnit);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: UnitVm, isArray: true })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Unit.modelName, 'GetAll'))
    async get(): Promise<UnitVm[]> {
        try {
            const unitVm = await this.unitService.findAll();
            return this.unitService.map<UnitVm[]>(
                map(unitVm, unitsVm => unitsVm.toJSON()),
            );
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @ApiResponse({ status: HttpStatus.OK, type: UnitVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Unit.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<UnitVm> {
        try {
            const exist = await this.unitService.findById(id);
            if (exist) {
                const deleted = await this.unitService.delete(id);
                return this.unitService.map<UnitVm>(deleted.toJSON());
            } else {
                throw new HttpException(
                    'unit is not exist',
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    @ApiResponse({ status: HttpStatus.OK, type: UnitVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Unit.modelName, 'update'))
    async update(@Body() vm: UnitVm): Promise<UnitVm> {
        const { id, unitName } = vm;

        if (!vm || !id) {
            throw new HttpException(
                'Missing parameters',
                HttpStatus.BAD_REQUEST,
            );
        }

        const exist = await this.unitService.findById(id);

        if (!exist) {
            throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
        }
        exist.unitName = unitName;
        try {
            const updated = await this.unitService.update(id, exist);
            return this.unitService.map<UnitVm>(updated.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
