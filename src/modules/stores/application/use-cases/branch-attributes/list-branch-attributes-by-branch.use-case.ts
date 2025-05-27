import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IBranchAttribute } from 'src/modules/stores/domain/models/branch-attribute.interface';
import {
  IBranchAttributeRepositoryToken,
  IBranchAttributeRepository,
} from 'src/modules/stores/domain/repositories/branch-attributes.repository.interface';
import { GetBranchUseCase } from '../branches/get-branch.use-case';

@Injectable()
export class GetBranchAttributesByBranchUseCase
  implements IUseCase<number, IBranchAttribute[]>
{
  constructor(
    @Inject(IBranchAttributeRepositoryToken)
    private readonly repository: IBranchAttributeRepository,
    private readonly getBranchByIdUseCase: GetBranchUseCase,
  ) {}

  async execute(branchId: number): Promise<IBranchAttribute[]> {
    const branch = await this.getBranchByIdUseCase.execute(branchId);
    if (!branch) throw new NotFoundException(`Branch with ID ${branchId} not found`);

    const attributes = await this.repository.findAllByBranch(branchId);
    return attributes;
  }
}
