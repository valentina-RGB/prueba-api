import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BranchesEntity } from './branches.entity';
import { IImage } from '../../domain/models/images.interface';

@Entity('images')
export class ImageEntity implements IImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'image_type', type: 'varchar', length: 50, nullable: false })
  image_type: string;

  @Column({ name: 'image_url', type: 'text', nullable: false })
  image_url: string;

  @Column({ name: 'related_type', type: 'varchar', length: 20, nullable: false })
  related_type: string; // 'BRANCH', etc.

  @Column({ name: 'related_id', type: 'int' })
  related_id: number;

  @ManyToOne(() => BranchesEntity, (branch) => branch.images, {
    nullable: true,
  })
  @JoinColumn({
    name: 'related_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_image_branch',
  })
  branch?: BranchesEntity;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
