import 'automapper-ts/dist/automapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MapperService {
    mapper: AutoMapperJs.AutoMapper;

    constructor() {
        this.mapper = automapper;
        this.initializeMapper();
    }

    private static configure(config: AutoMapperJs.IConfiguration): void {
        config
            .createMap('User', 'UserVm')
            .forSourceMember('_id', opts => opts.ignore())
            .forSourceMember('password', opts => opts.ignore());

        config
            .createMap('FoodTag', 'FoodTagVm')
            .forSourceMember('_id', opts => opts.ignore());
        config
            .createMap('FoodTag[]', 'FoodTagVm[]')
            .forSourceMember('_id', opts => opts.ignore());

        config
            .createMap('Ingredient', 'IngredientVm')
            .forSourceMember('_id', opts => opts.ignore());
        config
            .createMap('Ingredient[]', 'IngredientVm[]')
            .forSourceMember('_id', opts => opts.ignore());

        config
            .createMap('Unit', 'UnitVm')
            .forSourceMember('_id', opts => opts.ignore());
        config
            .createMap('Unit[]', 'UnitVm[]')
            .forSourceMember('_id', opts => opts.ignore());

        config
            .createMap('Step', 'StepVm')
            .forSourceMember('_id', opts => opts.ignore());
        config
            .createMap('Step[]', 'StepVm[]')
            .forSourceMember('_id', opts => opts.ignore());

        config
            .createMap('IngredientDetail', 'IngredientDetailVm')
            .forSourceMember('_id', opts => opts.ignore());
        config
            .createMap('IngredientDetail[]', 'IngredientDetailVm[]')
            .forSourceMember('_id', opts => opts.ignore());
    }

    private initializeMapper(): void {
        this.mapper.initialize(MapperService.configure);
    }
}
