import { ICriteria } from '../models/criteria.interface';

export interface ICriteriaRepository {
  findAllByStatus(status: boolean): Promise<ICriteria[]>;
  findById(id: number): Promise<ICriteria | null>;
}
export const ICriteriaRepositoryToken = Symbol('ICriteriaRepository');
