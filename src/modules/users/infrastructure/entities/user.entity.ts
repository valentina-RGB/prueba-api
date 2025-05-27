import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { IUser } from 'src/modules/users/domain/models/user.interface';
import { RoleEntity } from 'src/modules/users/infrastructure/entities/role.entity';
import { PeopleEntity } from './people.entity';

@Entity('users')
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  id_google?: string;

  @Column({ unique: true, nullable: false })
  @Index()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: true })
  status: boolean;

  @ManyToOne(() => RoleEntity, (role) => role.users, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => PeopleEntity, (person) => person.user)
  person: PeopleEntity;
}
