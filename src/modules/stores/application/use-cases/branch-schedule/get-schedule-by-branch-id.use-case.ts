import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IBranchSchedule } from 'src/modules/stores/domain/models/branch-schedule.interface';
import {
  IBranchScheduleRepository,
  IBranchScheduleRepositoryToken,
} from 'src/modules/stores/domain/repositories/branch-schedule.repository.interface';
import { GetBranchUseCase } from '../branches/get-branch.use-case';

@Injectable()
export class getScheduleByBranchIdUseCase
  implements IUseCase<number, IBranchSchedule[]>
{
  constructor(
    @Inject(IBranchScheduleRepositoryToken)
    private readonly branchScheduleRepository: IBranchScheduleRepository,
    private readonly getBranchById: GetBranchUseCase,
  ) {}

  async execute(branchId: number): Promise<IBranchSchedule[]> {
    const branch = await this.getBranchById.execute(branchId);
    if (!branch) throw new NotFoundException('Branch not found');

    const schedule =
      await this.branchScheduleRepository.getScheduleByBranchId(branchId);
    if (!schedule || schedule.length === 0)
      throw new NotFoundException('No schedule found for this branch');

    return schedule;
  }
}
