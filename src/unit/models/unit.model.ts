import { BaseModel } from '../../shared/base.model';
import { prop, ModelType } from 'typegoose';
import { schemaOptions } from '../../shared/base.model';
export class Unit extends BaseModel<Unit> {
    @prop({ required: [true, 'Content is required'], unique: true })
    unitName: string;
    static get model(): ModelType<Unit> {
        return new Unit().getModelForClass(Unit, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
