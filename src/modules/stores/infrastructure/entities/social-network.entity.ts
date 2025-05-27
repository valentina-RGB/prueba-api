import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ISocialNetwork } from '../../domain/models/social-network.interface';
import { SocialBranchEntity } from './social-branch.entity';

@Entity('social_networks')
export class SocialNetworkEntity implements ISocialNetwork {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @OneToMany(
    () => SocialBranchEntity,
    (social_branch) => social_branch.social_network,
  )
  social_branches: SocialBranchEntity[];
}
