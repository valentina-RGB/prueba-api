import { BranchesEntity } from 'src/modules/stores/infrastructure/entities/branches.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { EventEntity } from './events.entity';
import { IEventBranches } from '../../domain/models/event-branches.interface';

@Entity('event_branches')
export class EventBranchEntity implements IEventBranches {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => EventEntity, (e) => e.branches, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'event_id' })
  event: EventEntity;

  @ManyToOne(() => BranchesEntity, (branch) => branch.eventBranches, {
    onDelete: 'CASCADE',
  })
  // @JoinColumn({ name: 'branch_id' })
  branch: BranchesEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
