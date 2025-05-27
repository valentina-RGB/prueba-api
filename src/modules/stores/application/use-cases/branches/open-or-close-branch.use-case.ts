import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import {
  IBranchRepositoryToken,
  IBranchesRepository,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';

export class OpenOrCloseBranchUseCase
  implements IUseCase<{ id: number; status: boolean }, IBranches>
{
  constructor(
    @Inject(IBranchRepositoryToken)
    private readonly branchRepository: IBranchesRepository,
  ) {}

  async execute({
    id,
    status,
  }: {
    id: number;
    status: boolean;
  }): Promise<IBranches> {
    const branch = await this.branchRepository.findById(id);
    if (!branch) throw new NotFoundException('Branch not found');

    if (branch.is_open === status)
      throw new ConflictException('Branch already in this state');

    branch.is_open = status;

    return this.branchRepository.openOrCloseBranch(branch);
  }
}
