import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IAttribute } from '../../domain/models/attributes.interface';
import { BranchAttributeEntity } from './branches-attributes.entity';

@Entity('attributes')
export class AttributeEntity implements IAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ default: false, nullable: false })
  requires_response: boolean;
  
  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BranchAttributeEntity, (branchAttribute) => branchAttribute.attribute,)
  branch_attributes: BranchAttributeEntity[];
}
