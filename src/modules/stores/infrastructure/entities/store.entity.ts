import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IStore } from 'src/modules/stores/domain/models/store.interface';
import { AdministratorEntity } from 'src/modules/users/infrastructure/entities/admin.entity';
import { BranchesEntity } from './branches.entity';

@Entity('stores')
export class StoreEntity implements IStore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ name: 'type_document', default: 'NIT' })
  type_document: string;

  @Column({ name: 'number_document', length: 20, unique: true })
  number_document: string;

  @Column({ length: 255, nullable: true })
  logo: string;

  @Column({ name: 'phone_number', length: 20 })
  phone_number: string;

  @Column({ length: 70, unique: true })
  email: string;

  @Column({ default: 'APPROVED' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BranchesEntity, (branch) => branch.store)
  branches: BranchesEntity[];

  @OneToMany(() => AdministratorEntity, (admin) => admin.store)
  administrators: AdministratorEntity[];
}
