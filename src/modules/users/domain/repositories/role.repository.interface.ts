import { IRoleCreateDTO } from '../dto/role.dto.interface';
import { IRole } from '../models/role.interface';

export interface IRoleRepository {
  create(role: IRoleCreateDTO): Promise<IRole>;
  findById(id: number): Promise<IRole | null>;
  findByName(name: string): Promise<IRole | null>;
  findAll(): Promise<IRole[]>;
}

export const IRoleRepositoryToken = Symbol('IRoleRepository');
