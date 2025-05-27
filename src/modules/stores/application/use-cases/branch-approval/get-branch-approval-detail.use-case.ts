import { Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IBranchApproval } from 'src/modules/stores/domain/models/branch-approval.interface';
import {
  IBranchApprovalRepositoryToken,
  IBranchApprovalRepository,
} from 'src/modules/stores/domain/repositories/branch-approval.repository.interface';

export class GetBranchApprovalDetailUseCase
  implements IUseCase<number, IBranchApproval | null>
{
  constructor(
    @Inject(IBranchApprovalRepositoryToken)
    private readonly approvalRepository: IBranchApprovalRepository,
  ) {}

  async execute(branchId: number): Promise<IBranchApproval | null> {
    const detail = await this.approvalRepository.findLatestByBranch(branchId);
    if (!detail)
      throw new NotFoundException(
        `Branch approval for branch ${branchId} not found`,
      );
    return detail;
  }
}
