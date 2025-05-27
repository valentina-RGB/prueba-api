import {
  ICreateAttribute,
  IUpdateAttribute,
} from '../dto/attributes.interface.dto';
import { IAttribute } from '../models/attributes.interface';

export interface IAttributeRepository {
  findAll(): Promise<IAttribute[]>;
  findById(id: number): Promise<IAttribute | null>;
  create(attributeData: ICreateAttribute): Promise<IAttribute>;
  update(id: number, data: IUpdateAttribute): Promise<IAttribute>;
}

export const IAttributeRepositoryToken = Symbol('IAttributeRepository');
