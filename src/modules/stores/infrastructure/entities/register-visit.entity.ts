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
import { IRegisterVisit } from '../../domain/models/register-visit.interface';

@Entity('register_visit')
export class RegisterVisitEntity implements IRegisterVisit{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BranchesEntity, (branch) => branch.register_visits)
  @JoinColumn({ name: 'branch_id' })
  branch: BranchesEntity;

  @ManyToOne(() => ClientEntity, (client) => client.register_visits)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Column()
  visit_date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
