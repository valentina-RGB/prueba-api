import { EntityManager } from 'typeorm';
import { IEmployeeCreateDto} from '../dto/employe.dto.interface';
import { IEmployee } from '../models/employe.interface';

export interface IEmployeeRepository {
  createEmployee(employee: IEmployeeCreateDto): Promise<IEmployee>;
  findById(id: number): Promise<IEmployee | null>;
  findAll(): Promise<IEmployee[]>;
  findByPersonId(id: number): Promise<IEmployee | null>;
  withTransaction(manager: EntityManager): IEmployeeRepository;
}

export const IEmployeeRepositoryToken = Symbol('IEmployeeRepository');
