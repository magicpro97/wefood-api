import { Types } from 'mongoose';
import { InstanceType, ModelType, Typegoose } from 'typegoose';

export class BaseService<T extends Typegoose> {
    protected model: ModelType<T>;
    protected mapper: AutoMapperJs.AutoMapper;

    private get modelName(): string {
        return this.model.modelName;
    }

    private get viewModelName(): string {
        return `${this.model.modelName}Vm`;
    }

    async map<K>(
        object: Partial<InstanceType<T>> | Array<Partial<InstanceType<T>>>,
        isArray: boolean = false,
        sourceKey?: string,
        destinationKey?: string,
    ): Promise<K> {
        // tslint:disable-next-line:variable-name
        const _sourceKey = isArray
            ? `${sourceKey || this.modelName}[]`
            : sourceKey || this.modelName;
        // tslint:disable-next-line:variable-name
        const _destinationKey = isArray
            ? `${destinationKey || this.viewModelName}[]`
            : destinationKey || this.viewModelName;

        return this.mapper.map(_sourceKey, _destinationKey, object);
    }

    async findAll(filter = {}): Promise<Array<InstanceType<T>>> {
        return this.model.find(filter).exec();
    }

    async deleteAll(filter = {}): Promise<Array<InstanceType<T>>> {
        const all = await this.model.find(filter).exec();
        const allIds = all.map(item => item.id);
        for (const id of allIds) {
            await this.model.findByIdAndDelete(id).exec();
        }
        return all;
    }

    async findOne(filter = {}): Promise<InstanceType<T>> {
        return this.model.findOne(filter).exec();
    }

    async findOneAndUpdate(filter = {}, obj: any): Promise<InstanceType<T>> {
        return this.model
            .findOneAndUpdate(
                filter,
                { $set: obj },
                { upsert: true, new: true },
            )
            .exec();
    }

    async findOneAndDelete(filter = {}): Promise<InstanceType<T>> {
        return this.model.findOneAndDelete(filter).exec();
    }

    async findById(id: string): Promise<InstanceType<T>> {
        return this.model.findById(this.toObjectId(id)).exec();
    }

    async create(item: InstanceType<T>): Promise<InstanceType<T>> {
        return this.model.create(item);
    }

    async delete(id: string): Promise<InstanceType<T>> {
        return this.model.findByIdAndRemove(this.toObjectId(id)).exec();
    }

    async update(id: string, item: InstanceType<T>): Promise<InstanceType<T>> {
        return this.model
            .findByIdAndUpdate(this.toObjectId(id), item, { new: true })
            .exec();
    }

    async clearCollection(filter = {}): Promise<void> {
        this.model.deleteMany(filter).exec();
    }

    private toObjectId(id: string): Types.ObjectId {
        return Types.ObjectId(id);
    }
}
