import { IStoreCreateDto } from '../dto/store.interface.dto';
import { IStore } from '../models/store.interface';

export interface IStoreRepository {
  create(role: IStoreCreateDto): Promise<IStore>;
  findById(id: number): Promise<IStore | null>;
  findAll(): Promise<IStore[]>;
  findByStatus(status: string): Promise<IStore[]>;
  update(id: number, role: IStore): Promise<IStore>;
}

export const IStoreRepositoryToken = Symbol('IRoleRepository');
