import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ISocialBranch } from '../../domain/models/social-branch.interface';
import { BranchesEntity } from './branches.entity';
import { SocialNetworkEntity } from './social-network.entity';

@Entity('social_branches')
export class SocialBranchEntity implements ISocialBranch {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BranchesEntity, (branch) => branch.social_branches, {
    eager: true,
  })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchesEntity;

  @ManyToOne(
    () => SocialNetworkEntity,
    (social_network) => social_network.social_branches,
    { eager: true },
  )
  @JoinColumn({ name: 'social_network_id' })
  social_network: SocialNetworkEntity;

  @Column({ length: 100 })
  description: string;

  @Column({ length: 255 })
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
