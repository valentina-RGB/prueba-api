export class BranchApprovalResponseDto {
  id: number;
  status: string;
  comments?: string;
  branch_id: number;
  branch_name: string;
  approved_by: {
    full_name: string;
    email: string;
  };

  constructor(branchApproval: any) {
    this.id = branchApproval.id;
    this.comments = branchApproval.comments;
    this.branch_id = branchApproval.branch?.id || null,
    this.branch_name = branchApproval.branch?.name || null,
    this.status = branchApproval.status;
    this.approved_by = {
      full_name: branchApproval.approved_by.person.full_name || null,
      email: branchApproval.approved_by.person.user.email || null,
    };
  }
}
