import { EntityManager } from 'typeorm';
import { IEventBranches } from '../models/event-branches.interface';

export interface IEventBranchesRepository {
  create(data: any): Promise<IEventBranches>;
  findByEventId(eventId: number): Promise<IEventBranches[]>;
  withTransaction(manager: EntityManager): IEventBranchesRepository;
}

export const IEventBranchesRepositoryToken = Symbol('IEventBranchesRepository');