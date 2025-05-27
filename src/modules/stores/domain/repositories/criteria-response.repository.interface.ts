import { ICreateCriteriaResponseDto } from '../dto/criteria.interface.dto';
import { IBranchApproval } from '../models/branch-approval.interface';
import { ICriteriaResponse } from '../models/criteria-response.interface';

export interface ICriteriaResponseRepository {
  createMany(
    responses: ICreateCriteriaResponseDto[],
  ): Promise<ICriteriaResponse[]>;
}
export const ICriteriaResponseRepositoryToken = Symbol('ICriteriaResponseRepository');