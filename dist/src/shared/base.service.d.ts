import { InstanceType, ModelType, Typegoose } from 'typegoose';
export declare class BaseService<T extends Typegoose> {
    protected model: ModelType<T>;
    protected mapper: AutoMapperJs.AutoMapper;
    private readonly modelName;
    private readonly viewModelName;
    map<K>(object: Partial<InstanceType<T>> | Array<Partial<InstanceType<T>>>, isArray?: boolean, sourceKey?: string, destinationKey?: string): Promise<K>;
    findAll(filter?: {}): Promise<Array<InstanceType<T>>>;
    findOne(filter?: {}): Promise<InstanceType<T>>;
    findById(id: string): Promise<InstanceType<T>>;
    create(item: InstanceType<T>): Promise<InstanceType<T>>;
    delete(id: string): Promise<InstanceType<T>>;
    update(id: string, item: InstanceType<T>): Promise<InstanceType<T>>;
    clearCollection(filter?: {}): Promise<void>;
    private toObjectId;
}
