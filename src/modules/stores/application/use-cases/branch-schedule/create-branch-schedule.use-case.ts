import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IBranchScheduleCreateDto } from 'src/modules/stores/domain/dto/branch-schedule.interface.dto';
import { IBranchSchedule } from 'src/modules/stores/domain/models/branch-schedule.interface';
import { IBranchScheduleRepository, IBranchScheduleRepositoryToken } from 'src/modules/stores/domain/repositories/branch-schedule.repository.interface';
import {
  ISocialBranchRepository,
  ISocialBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/social-branch.repository.interface';
import { GetBranchUseCase } from '../branches/get-branch.use-case';

@Injectable()
export class CreateBranchScheduleUseCase
  implements IUseCase<IBranchScheduleCreateDto, IBranchSchedule>
{
  constructor(
    @Inject(IBranchScheduleRepositoryToken)
    private readonly branchScheduleRepository: IBranchScheduleRepository,
    private readonly getBranchUseCase: GetBranchUseCase,
    
  ) {}

  async execute(data: IBranchScheduleCreateDto): Promise<IBranchSchedule> {
    if (!data.branch_id) throw new NotFoundException('Branch ID not provided');

    const branch = await this.getBranchUseCase.execute(data.branch_id);

    if (!branch) throw new NotFoundException('Branch not found');

    if(branch.status !== 'APPROVED'){
      throw new BadRequestException('Branch is not approved');
    }

    const existingSchedule = await this.branchScheduleRepository.findByBranchAndDay(data.branch_id, data.day);
    if (existingSchedule) {
      throw new ConflictException(`You already have a schedule assigned for the day ${data.day}`);
    }

    const branchSchedule = await this.branchScheduleRepository.create({
      branch,
      day: data.day,
      open_time: data.open_time,
      close_time: data.close_time,
    });

    return branchSchedule;
  }
}
