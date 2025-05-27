import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IBranchAttribute } from '../../domain/models/branch-attribute.interface';
import { BranchesEntity } from './branches.entity';
import { AttributeEntity } from 'src/modules/stores/infrastructure/entities/attributes.entity';

@Entity('branch_attributes')
@Unique(['branch', 'attribute'])
export class BranchAttributeEntity implements IBranchAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BranchesEntity, (branch) => branch.branch_attributes, {
    eager: true,
  })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchesEntity;

  @ManyToOne(
    () => AttributeEntity,
    (attribute) => attribute.branch_attributes,
    { eager: true },
  )
  @JoinColumn({ name: 'attribute_id' })
  attribute: AttributeEntity;

  @Column({ length: 255, nullable: true })
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
