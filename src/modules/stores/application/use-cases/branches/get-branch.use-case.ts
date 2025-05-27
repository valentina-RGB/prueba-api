import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IBranches } from '../../../domain/models/branches.interface';
import {
  IBranchRepositoryToken,
  IBranchesRepository,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';

@Injectable()
export class GetBranchUseCase implements IUseCase<number, IBranches | null> {
  constructor(
    @Inject(IBranchRepositoryToken)
    private readonly branchRepository: IBranchesRepository,
  ) {}

  async execute(id: number): Promise<IBranches | null> {
    const branch = await this.branchRepository.findById(id);
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }
    return branch;
  }
}
