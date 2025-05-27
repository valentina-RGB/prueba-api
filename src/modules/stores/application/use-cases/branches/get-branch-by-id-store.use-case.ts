import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import {
  IBranchRepositoryToken,
  IBranchesRepository,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';

@Injectable()
export class GetBranchByIdStoreUseCase
  implements IUseCase<number, IBranches[] | null>
{
  constructor(
    @Inject(IBranchRepositoryToken)
    private readonly branchRepository: IBranchesRepository,
  ) {}

  async execute(store_id: number): Promise<IBranches[] | null> {
    if (!store_id || isNaN(store_id)) {
      throw new NotFoundException('Invalid store ID');
    }

    const branches = await this.branchRepository.findByStoreId(store_id);

    return branches || [];
  }
}
