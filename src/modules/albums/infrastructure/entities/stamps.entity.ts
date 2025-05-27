import { IStamps } from '../../domain/models/stamps.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BranchesEntity } from 'src/modules/stores/infrastructure/entities/branches.entity';
import { StampClientEntity } from './stamp-clients.entity';
import { PageStampsEntity } from './page-stamps.entity';

@Entity('stamps')
export class StampsEntity implements IStamps {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BranchesEntity, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchesEntity;

  @Column({ type: 'varchar', nullable: false })
  logo: string;

  // @Column({ type: 'varchar', length: 30, default: 'BRANCH' })
  // type: string; // 'BRANCHES' | 'EVENTS' | 'OTHERS';

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'int', nullable: false, default: 10 })
  coffeecoins_value: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StampClientEntity, (stamps) => stamps.stamp)
  stamp_clients: StampClientEntity[];

  @OneToMany(() => PageStampsEntity, (stamps) => stamps.stamp)
  page_stamps: PageStampsEntity[];
}
