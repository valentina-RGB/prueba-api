import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import {
  IBranchRepositoryToken,
  IBranchesRepository,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';


@Injectable()
export class ListBranchesByStatusUseCase
  implements IUseCase<string, IBranches[]>
{
  constructor(
    @Inject(IBranchRepositoryToken)
    private readonly branchRepository: IBranchesRepository,
  ) {}

  async execute(status: string): Promise<IBranches[]> {
    try {
      const branches = await this.branchRepository.findByStatus(status);
      return branches;
    } catch (error) {
      throw error;
    }
  }
}
