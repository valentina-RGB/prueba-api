import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BranchesEntity } from './branches.entity';
import { ClientEntity } from 'src/modules/users/infrastructure/entities/client.entity';
import { IRecommendation } from '../../domain/models/recommendations.interface';

@Entity('recommendations')
export class RecommendationEntity implements IRecommendation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClientEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @ManyToOne(() => BranchesEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchesEntity;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
