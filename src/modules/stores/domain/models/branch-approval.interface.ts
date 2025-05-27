import { IAdministrator } from 'src/modules/users/domain/models/admin.interface';
import { IBranches } from './branches.interface';
import { ICriteriaResponse } from './criteria-response.interface';

export interface IBranchApproval {
  id: number;
  status: string; // 'PENDING' | 'APPROVED' | 'REJECTED';
  comments?: string;
  approval_date: Date;
  branch: IBranches;
  approved_by: IAdministrator | null;
  criteria_responses: ICriteriaResponse[];
  updatedAt: Date;
}
