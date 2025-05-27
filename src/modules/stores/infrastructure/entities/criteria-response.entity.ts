import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CriteriaEntity } from './criteria.entity';
import { BranchApprovalEntity } from './branch-approval.entity';
import { ICriteriaResponse } from '../../domain/models/criteria-response.interface';

@Entity('criteria_responses')
export class CriteriaResponseEntity implements ICriteriaResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  response_text: string;

  @Column({ length: 255, nullable: true })
  image_url: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CriteriaEntity, (criteria) => criteria.responses, { nullable: false })
  @JoinColumn({ name: 'criteria_id' })
  criteria: CriteriaEntity;

  @ManyToOne(() => BranchApprovalEntity, (approval) => approval.criteria_responses, { nullable: false })
  @JoinColumn({ name: 'approval_id' })
  approval: BranchApprovalEntity;
}