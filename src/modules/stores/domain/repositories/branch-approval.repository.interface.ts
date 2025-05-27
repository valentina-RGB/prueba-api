import { EntityManager } from 'typeorm';
import { ICreateBranchApprovalDto } from '../dto/branch-approval.interface.dto';
import { IBranchApproval } from '../models/branch-approval.interface';

export interface IBranchApprovalRepository {
  findById(id: number): Promise<IBranchApproval | null>;
  create(approvalData: ICreateBranchApprovalDto): Promise<IBranchApproval>;
  update(id: number, data: Partial<IBranchApproval>, manager: EntityManager): Promise<IBranchApproval>;
  findLatestByBranch(branchId: number): Promise<IBranchApproval | null>;
}
export const IBranchApprovalRepositoryToken = Symbol('IBranchApprovalRepository');
