import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { IPeople } from 'src/modules/users/domain/models/people.interface';
import { UserEntity } from 'src/modules/users/infrastructure/entities/user.entity';
import { AdministratorEntity } from './admin.entity';

@Entity('people')
export class PeopleEntity implements IPeople {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'type_document', default: 'CC', nullable: false })
  type_document: string;

  @Column({ unique: true, nullable: false })
  number_document: string;

  @Column({ nullable: false })
  full_name: string;

  @Column({ nullable: true })
  phone_number: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => AdministratorEntity, (admin) => admin.person)
  administrator: AdministratorEntity;
}
