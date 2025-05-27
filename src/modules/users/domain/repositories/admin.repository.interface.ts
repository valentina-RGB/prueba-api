import { EntityManager } from 'typeorm';
import { IAdminCreateDto } from '../dto/admin.dto.interface';
import { IAdministrator } from '../models/admin.interface';

export interface IAdminRepository {
  create(data: IAdminCreateDto): Promise<any>;
  findById(id: number): Promise<any>;
  findByUserId(id: number): Promise<IAdministrator | null>;
  findAll(): Promise<any>;
  findOne(options: object): Promise<any>;
  withTransaction(manager: EntityManager): IAdminRepository;
}

export const IAdminRepositoryToken = Symbol('IAdminRepository');
