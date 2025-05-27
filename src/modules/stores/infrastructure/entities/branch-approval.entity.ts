import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BranchesEntity } from './branches.entity';
import { CriteriaResponseEntity } from './criteria-response.entity';
import { AdministratorEntity } from 'src/modules/users/infrastructure/entities/admin.entity';
import { IBranchApproval } from '../../domain/models/branch-approval.interface';

@Entity('branch_approvals')
export class BranchApprovalEntity implements IBranchApproval {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'PENDING' })
  status: string; // PENDING, APPROVED, REJECTED

  @Column({ type: 'text', nullable: true })
  comments: string;

  @CreateDateColumn()
  approval_date: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => BranchesEntity, (branch) => branch.approvals, { nullable: false })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchesEntity;

  @ManyToOne(() => AdministratorEntity, { nullable: true })
  @JoinColumn({ name: 'approved_by_id' })
  approved_by: AdministratorEntity;

  @OneToMany(() => CriteriaResponseEntity, (response) => response.approval)
  criteria_responses: CriteriaResponseEntity[];
}