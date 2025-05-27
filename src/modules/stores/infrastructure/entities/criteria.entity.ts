import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CriteriaResponseEntity } from './criteria-response.entity';
import { ICriteria } from '../../domain/models/criteria.interface';

@Entity('criteria')
export class CriteriaEntity implements ICriteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  requires_image: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CriteriaResponseEntity, (response) => response.criteria)
  responses: CriteriaResponseEntity[];
}
