import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IEmployee } from '../../domain/models/employe.interface';
import { PeopleEntity } from './people.entity';
import { BranchesEntity } from 'src/modules/stores/infrastructure/entities/branches.entity';

@Entity('employee')
export class EmployeEntity implements IEmployee {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => PeopleEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'person_id' })
  person: PeopleEntity;

  @Column({ type: 'varchar', length: 50, nullable: false })
  employee_type: string;

  @ManyToOne(() => BranchesEntity, (branch) => branch.employees, {
    nullable: false,
  })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchesEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
