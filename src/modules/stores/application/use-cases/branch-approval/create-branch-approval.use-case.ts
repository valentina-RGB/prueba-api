import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IBranchApprovalRepository,
  IBranchApprovalRepositoryToken,
} from 'src/modules/stores/domain/repositories/branch-approval.repository.interface';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IBranchApproval } from 'src/modules/stores/domain/models/branch-approval.interface';
import { GetBranchUseCase } from '../branches/get-branch.use-case';
import { CreateCriteriaResponsesUseCase } from '../criteria-response/create-criteria-responses.use-case';
import { CreateCriteriaResponseDto } from '../../dto/criteria-response/create-criteria-response.dto';

@Injectable()
export class CreateBranchApprovalUseCase
  implements
    IUseCase<
      {
        branchId: number;
        comments?: string;
        criteriaResponseData: CreateCriteriaResponseDto[];
      },
      IBranchApproval
    >
{
  constructor(
    @Inject(IBranchApprovalRepositoryToken)
    private readonly approvalRepo: IBranchApprovalRepository,
    private readonly getBranchUseCse: GetBranchUseCase,
    private readonly createCriteriaResponses: CreateCriteriaResponsesUseCase,
  ) {}

  async execute({
    branchId,
    comments,
    criteriaResponseData,
  }: {
    branchId: number;
    comments?: string;
    criteriaResponseData: CreateCriteriaResponseDto[];
  }) {
    const branch = await this.getBranchUseCse.execute(branchId);
    if (!branch) throw new NotFoundException('Branch not found');

    const approval = await this.approvalRepo.create({
      branch,
      comments,
    });

    await this.createCriteriaResponses.execute({
      criteriaResponseData,
      approval,
    });

    return approval;
  }
}
