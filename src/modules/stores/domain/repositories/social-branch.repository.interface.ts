import { EntityManager } from 'typeorm';
import { ISocialBranchCreateDto } from '../dto/social-branch.interface.dto';
import { ISocialBranch } from '../models/social-branch.interface';

export interface ISocialBranchRepository {
  findAll(): Promise<ISocialBranch[]>;
  findById(id: number): Promise<ISocialBranch | null>;
  create(socialBranch: ISocialBranchCreateDto, manager: EntityManager): Promise<ISocialBranch>;
}

export const ISocialBranchRepositoryToken = Symbol('ISocialBranchRepository');
