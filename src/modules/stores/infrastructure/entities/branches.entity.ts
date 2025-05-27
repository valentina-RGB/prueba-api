import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { StoreEntity } from 'src/modules/stores/infrastructure/entities/store.entity';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { AdministratorEntity } from 'src/modules/users/infrastructure/entities/admin.entity';
import { EmployeEntity } from 'src/modules/users/infrastructure/entities/employe.entity';
import { BranchApprovalEntity } from './branch-approval.entity';
import { SocialBranchEntity } from './social-branch.entity';
import { StampsEntity } from 'src/modules/albums/infrastructure/entities/stamps.entity';
import { ImageEntity } from './images.entity';
import { ReviewEntity } from './review.entity';
import { BranchAttributeEntity } from './branches-attributes.entity';
import { RegisterVisitEntity } from './register-visit.entity';
import { BranchScheduleEntity } from './branch-schedule.entity';
import { EventBranchEntity } from 'src/modules/events/infrastructure/entities/event-branches.entity';

@Entity('branches')
export class BranchesEntity implements IBranches {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StoreEntity, { nullable: false })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @OneToMany(
    () => BranchAttributeEntity,
    (branchAttribute) => branchAttribute.branch,
  )
  branch_attributes: BranchAttributeEntity[];

  @Column({ unique: true })
  name: string;

  @Column()
  phone_number: string;

  @Column({ type: 'double precision', default: 0 })
  latitude: number;

  @Column({ type: 'double precision', default: 0 })
  longitude: number;

  @Column({ default: '' })
  address: string;

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 1,
    nullable: true,
    default: 0.0,
  })
  average_rating: number;

  @Column({ default: 'PENDING' })
  status: string;

  @Column({ default: true, nullable: false })
  is_open: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AdministratorEntity, (admin) => admin.branch)
  administrators: AdministratorEntity[];

  @OneToMany(() => ImageEntity, (image) => image.branch)
  images: ImageEntity[];

  @OneToMany(() => EmployeEntity, (employee) => employee.branch)
  employees: EmployeEntity[];

  @OneToMany(() => BranchApprovalEntity, (approval) => approval.branch)
  approvals: BranchApprovalEntity[];

  @OneToMany(() => SocialBranchEntity, (socialBranch) => socialBranch.branch)
  social_branches: SocialBranchEntity[];

  @OneToMany(() => StampsEntity, (stamp) => stamp.branch)
  stamps: StampsEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.branch)
  reviews: ReviewEntity[];

  @OneToMany(() => RegisterVisitEntity, (registerVisit) => registerVisit.branch)
  register_visits: RegisterVisitEntity[];

  @OneToMany(
    () => BranchScheduleEntity,
    (branchSchedule) => branchSchedule.branch,
  )
  branch_schedules: BranchScheduleEntity[];

  @OneToMany(() => EventBranchEntity, (eventBranch) => eventBranch.branch)
  eventBranches: EventBranchEntity[];
}
