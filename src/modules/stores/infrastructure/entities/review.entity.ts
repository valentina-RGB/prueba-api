import { ClientEntity } from 'src/modules/users/infrastructure/entities/client.entity';
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
import { IReview } from '../../domain/models/review.interface';

@Entity('reviews')
export class ReviewEntity implements IReview{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BranchesEntity, (branch) => branch.reviews, {
    nullable: false,
  })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchesEntity;

  @ManyToOne(() => ClientEntity, (client) => client.reviews, {
    nullable: false,
  })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Column({ type: 'int', default: 0 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'text', array: true, nullable: true })
  image_urls: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
