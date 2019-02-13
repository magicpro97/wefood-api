import { Document, SchemaOptions } from 'mongoose';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

export interface BaseModel extends Document {
  createAt?: Date;
  updateAt?: Date;
}

export class BaseModelVm {
  @ApiModelPropertyOptional({ type: String, format: 'date-time' })
  createAt?: Date;
  @ApiModelPropertyOptional({ type: String, format: 'date-time' })
  updateAt?: Date;
  @ApiModelPropertyOptional()
  id?: string;
}

export const schemaOptions: SchemaOptions = {
  toJSON: {
    virtuals: true,
    getters: true,
  },
};
