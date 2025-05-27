import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { PeopleEntity } from './people.entity';
import { StoreEntity } from 'src/modules/stores/infrastructure/entities/store.entity';
import { BranchesEntity } from 'src/modules/stores/infrastructure/entities/branches.entity';
import { IAdministrator } from '../../domain/models/admin.interface';

@Entity('administrators')
export class AdministratorEntity implements IAdministrator {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => PeopleEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'person_id' })
  person: PeopleEntity;

  @Column({
    type: 'varchar',
    enum: ['SYSTEM', 'STORE', 'BRANCH'],
    name: 'admin_type',
    nullable: true,
  })
  admin_type: 'SYSTEM' | 'STORE' | 'BRANCH';

  @Column({
    type: 'int',
    name: 'entity_id',
    nullable: true,
  })
  entity_id?: number;

  @ManyToOne(() => StoreEntity, (store) => store.administrators, {
    nullable: true,
  })
  @JoinColumn({
    name: 'entity_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_admin_store',
  })
  store?: StoreEntity;

  @ManyToOne(() => BranchesEntity, (branch) => branch.administrators, {
    nullable: true,
  })
  @JoinColumn({
    name: 'entity_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_admin_branch',
  })
  branch?: BranchesEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
