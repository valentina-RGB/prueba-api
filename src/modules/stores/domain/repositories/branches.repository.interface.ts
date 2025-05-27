import { EntityManager } from 'typeorm';
import { IBranchesCreateDto } from '../dto/branch.interface.dto';
import { IBranches } from '../models/branches.interface';

export interface IBranchesRepository {
  createBranch(
    branch: IBranchesCreateDto,
    manager: EntityManager,
  ): Promise<IBranches>;
  findById(id: number): Promise<IBranches | null>;
  findByStoreId(id: number): Promise<IBranches[] | null>;
  findByStatus(status: string): Promise<IBranches[]>;
  findAll(): Promise<IBranches[]>;
  getAllSortedByProximity(
    lat: number,
    long: number,
  ): Promise<IBranches[] | null>;
  update(id: number, data: Partial<IBranches>): Promise<IBranches>;
  openOrCloseBranch(branch: IBranches): Promise<IBranches>;
}

export const IBranchRepositoryToken = Symbol('IBranchesRepository');
