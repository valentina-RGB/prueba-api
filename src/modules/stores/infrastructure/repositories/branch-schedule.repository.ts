import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchScheduleEntity } from '../entities/branch-schedule.entity';
import { Repository } from 'typeorm';
import { IBranchScheduleRepository } from '../../domain/repositories/branch-schedule.repository.interface';
import { IBranchScheduleCreateDto } from '../../domain/dto/branch-schedule.interface.dto';
import { IBranchSchedule } from '../../domain/models/branch-schedule.interface';

@Injectable()
export class BranchScheduleRepository implements IBranchScheduleRepository {
  constructor(
    @InjectRepository(BranchScheduleEntity)
    private readonly branchScheduleRepository: Repository<BranchScheduleEntity>,
  ) {}

  create(data: IBranchScheduleCreateDto): Promise<IBranchSchedule> {
    return this.branchScheduleRepository.save(data);
  }

  async findByBranchAndDay(branchId: number, days: string): Promise<IBranchSchedule | null> {
  return this.branchScheduleRepository.findOne({
    where: branchId ? { branch: { id: branchId }, day: days } : { day: days },
  });
}

  async getScheduleByBranchId(branchId: number): Promise<IBranchSchedule[]> {
    return this.branchScheduleRepository.find({
      where: { branch: { id: branchId } },
      order: { day: 'ASC' },
    });
  }
}
