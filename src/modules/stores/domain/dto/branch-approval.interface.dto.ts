import { IAdministrator } from 'src/modules/users/domain/models/admin.interface';
import { IBranches } from '../models/branches.interface';
import { ICreateCriteriaResponseDto } from './criteria.interface.dto';

export interface ICreateBranchApprovalDto {
  branch?: IBranches;
  comments?: string;
  criteriaResponses?: ICreateCriteriaResponseDto[];
}

export interface IUpdateBranchApprovalStatusDto {
  approvalId?: number;
  status: string; // 'APPROVED' | 'REJECTED';
  approvedBy?: IAdministrator;
  comments?: string;
}
