import { ICreateStampDto, IUpdateStampDto } from '../dto/stamp.dto.interface';
import { IStamps } from '../models/stamps.interface';

export interface IStampRepository {
  create(data: ICreateStampDto): Promise<IStamps>;
  findAll(): Promise<IStamps[]>;
  findById(id: number): Promise<IStamps | null>;
  ListStampByIdBranch(id: number): Promise<IStamps | null>;
  update(id: number, data: IUpdateStampDto): Promise<IStamps>;
}

export const IStampRepositoryToken = Symbol('IStampRepository');
