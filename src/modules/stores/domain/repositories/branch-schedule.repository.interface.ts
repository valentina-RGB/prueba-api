import { IBranchScheduleCreateDto } from '../dto/branch-schedule.interface.dto';
import { IBranchSchedule } from '../models/branch-schedule.interface';

export interface IBranchScheduleRepository {
  create(data: IBranchScheduleCreateDto): Promise<IBranchSchedule>;
  findByBranchAndDay(branchId: number, day: string): Promise<IBranchSchedule | null>;
  getScheduleByBranchId(branchId: number): Promise<IBranchSchedule[]>;
}

export const IBranchScheduleRepositoryToken = Symbol('IBranchScheduleRepository');
