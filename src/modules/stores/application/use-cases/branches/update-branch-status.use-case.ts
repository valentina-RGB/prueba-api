import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { CreateStampUseCase } from 'src/modules/albums/application/use-cases/stamp/create-stamp.use-case';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import {
  IBranchesRepository,
  IBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';

@Injectable()
export class UpdateBranchStatusUseCase
  implements IUseCase<{ id: number; data: boolean }, IBranches | null>
{
  constructor(
    @Inject(IBranchRepositoryToken)
    private readonly branchRepository: IBranchesRepository,
    private readonly createStampUseCase: CreateStampUseCase, 
  ) {}

  async execute({
    id,
    data,
  }: {
    id: number;
    data: boolean;
  }): Promise<IBranches | null> {
    const branch = await this.branchRepository.findById(id);
    if (!branch) throw new NotFoundException('Branch not found');

    branch.status = data ? 'APPROVED' : 'REJECTED';
    const newBranch = await this.branchRepository.update(id, branch);

    if (newBranch.status === 'APPROVED') {
      await this.createStampUseCase.execute({branch_id: branch.id});
    }

    return branch;
  }
}