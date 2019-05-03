import { MongooseModule } from '@nestjs/mongoose';
import { Unit } from './models/unit.model';
import { Module } from '@nestjs/common';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Unit.modelName,
                schema: Unit.model.schema,
            },
        ]),
    ],
    controllers: [UnitController],
    providers: [UnitService],
    exports: [UnitService],
})
export class UnitModule {}
