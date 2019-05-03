import { Module } from '@nestjs/common';
import { StepController } from './step.controller';
import { StepService } from './step.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Step } from './models/step.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Step.modelName,
                schema: Step.model.schema,
            },
        ]),
    ],
    controllers: [StepController],
    providers: [StepService],
    exports: [StepService],
})
export class StepModule {}
