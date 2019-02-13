import { Document, Model, Types } from 'mongoose';

export class BaseService<T extends Document> {
  protected model: Model<T>;
  protected mapper: AutoMapperJs.AutoMapper;

  private get modelName(): string {
    return this.model.modelName;
  }

  private get viewModelName(): string {
    return `${this.model.modelName}Vm`;
  }

  async map<K>(
    object: Partial<T> | Array<Partial<T>>,
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

  async findAll(filter = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  async findOne(filter = {}): Promise<T> {
    return this.model.findOne(filter).exec();
  }

  async findById(id: string): Promise<T> {
    return this.model.findById(this.toObjectId(id)).exec();
  }

  async create(item: T): Promise<T> {
    return this.model.create(item);
  }

  async delete(id: string): Promise<T> {
    return this.model.findByIdAndRemove(this.toObjectId(id)).exec();
  }

  async update(id: string, item: T): Promise<T> {
    return this.model
      .findByIdAndUpdate(this.toObjectId(id), item, { new: true })
      .exec();
  }

  private toObjectId(id: string): Types.ObjectId {
    return Types.ObjectId(id);
  }
}
