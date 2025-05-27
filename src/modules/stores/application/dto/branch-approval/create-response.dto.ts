export class BranchApprovalResponseCreateDto {
  id: number;
  status: string;
  comments?: string;
  branch_id: number;
  branch_name: string;

  constructor(branchApproval: any) {
    this.id = branchApproval.id;
    this.comments = branchApproval.comments;
    this.branch_id = branchApproval.branch?.id || null,
    this.branch_name = branchApproval.branch?.name || null,
    this.status = branchApproval.status;
  }
}