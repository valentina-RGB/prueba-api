import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IBranchSchedule } from '../../domain/models/branch-schedule.interface';
import { BranchesEntity } from './branches.entity';

@Entity('branch_schedule')
export class BranchScheduleEntity implements IBranchSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BranchesEntity, (branch) => branch.branch_schedules)
  @JoinColumn({ name: 'branch_id' })
  branch: BranchesEntity;

  @Column({ nullable: false, length: 9 })
  day: string;

  @Column({ nullable: false, type: 'time' })
  open_time: string;

  @Column({ nullable: false, type: 'time' })
  close_time: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
