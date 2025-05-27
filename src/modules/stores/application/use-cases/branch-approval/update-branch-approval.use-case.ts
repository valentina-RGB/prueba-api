import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { SendStoreApprovedEmailUseCase } from 'src/modules/mailer/application/use-cases/send-branch-approved.use-case';
import { SendStoreRejectionEmailUseCase } from 'src/modules/mailer/application/use-cases/send-branch-rejection.use-case';
import {
  IBranchApprovalRepository,
  IBranchApprovalRepositoryToken,
} from 'src/modules/stores/domain/repositories/branch-approval.repository.interface';
import { IBranchApproval } from 'src/modules/stores/domain/models/branch-approval.interface';
import { UpdateBranchStatusUseCase } from '../branches/update-branch-status.use-case';
import { DataSource } from 'typeorm';
import { GetAdminByUserUseCase } from 'src/modules/users/application/use-cases/admins/get-admin-by-user.use-case';

@Injectable()
export class UpdateBranchApprovalStatusUseCase
  implements
    IUseCase<
      {
        approvalId: number;
        data: boolean;
        comments?: string;
        approvedById: number;
      },
      IBranchApproval | null
    >
{
  constructor(
    @Inject(IBranchApprovalRepositoryToken)
    private readonly branchApprovalRepository: IBranchApprovalRepository,

    private readonly getAdminUseCase: GetAdminByUserUseCase,
    private readonly updateBranchStatusUseCase: UpdateBranchStatusUseCase,

    private sendStoreApprovedEmailUseCase: SendStoreApprovedEmailUseCase,
    private sendStoreRejectionEmailUseCase: SendStoreRejectionEmailUseCase,
    private readonly dataSource: DataSource,
  ) {}

  async execute({
    approvalId,
    data,
    comments,
    approvedById,
  }: {
    approvalId: number;
    data: boolean;
    comments?: string;
    approvedById: number;
  }): Promise<IBranchApproval | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const branchApproval =
        await this.branchApprovalRepository.findById(approvalId);
      if (!branchApproval)
        throw new NotFoundException('Branch approval not found');

      const admin = await this.getAdminUseCase.execute(approvedById);
      if (!admin) throw new NotFoundException('Administrator not found');

      branchApproval.status = data ? 'APPROVED' : 'REJECTED';
      branchApproval.comments = comments;
      branchApproval.approved_by = admin;

      await this.branchApprovalRepository.update(
        approvalId,
        branchApproval,
        queryRunner.manager,
      );

      await this.updateBranchStatusUseCase.execute({
        id: branchApproval.branch.id,
        data: data,
      });

      if (data) {
        await this.sendStoreApprovedEmailUseCase.execute(branchApproval.branch);
      } else {
        await this.sendStoreRejectionEmailUseCase.execute(
          branchApproval.branch,
          comments!,
        );
      }

      await queryRunner.commitTransaction();
      return branchApproval;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
