import { EntityManager } from 'typeorm';
import { IUserCreateDto, IUserUpdateDto } from '../dto/user.dto.interface';
import { IUser } from '../models/user.interface';

export interface IUserRepository {
  create(user: IUserCreateDto): Promise<IUser>;
  findById(id: number): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  update(id: number, userData: IUserUpdateDto): Promise<void>;
  delete(id: number): Promise<void>;
  withTransaction(manager: EntityManager): IUserRepository;
}

export const IUserRepositoryToken = Symbol('IUserRepository');
