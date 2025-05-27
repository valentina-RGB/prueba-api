import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { UpdateBranchDto } from '../../dto/branches/update-branch.dto';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import {
  IBranchRepositoryToken,
  IBranchesRepository,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';
import { GetStampByBranch } from 'src/modules/albums/application/use-cases/stamp/get-stamp-by-branch-id.use-case';
import { UpdateStampUseCase } from 'src/modules/albums/application/use-cases/stamp/update-stamp.use-case';

@Injectable()
export class UpdateBranchUseCase
  implements IUseCase<{ id: number; data: UpdateBranchDto }, IBranches>
{
  constructor(
    @Inject(IBranchRepositoryToken)
    private readonly branchRepository: IBranchesRepository,
    private readonly getStampByBranch: GetStampByBranch,
    private readonly updateStamp: UpdateStampUseCase,
  ) {}

  async execute({
    id,
    data,
  }: {
    id: number;
    data: UpdateBranchDto;
  }): Promise<IBranches> {
    const branch = await this.branchRepository.findById(id);
    if (!branch) throw new NotFoundException('Branch not found');

    if (branch.status !== 'APPROVED') throw new ConflictException('Branch not approval')
      
    if (data.name) {
      const stamp = await this.getStampByBranch.execute(id);
      if (!stamp) throw new NotFoundException('Stamp not found');
      stamp.name = data.name;

      await this.updateStamp.execute({id: stamp.id, data: stamp })
    }

    return await this.branchRepository.update(id, data);
  }
}
