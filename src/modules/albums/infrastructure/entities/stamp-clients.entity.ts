import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IStampClients } from '../../domain/models/stamp-clients.interface';
import { ClientEntity } from 'src/modules/users/infrastructure/entities/client.entity';
import { StampsEntity } from './stamps.entity';

@Entity('stamp_clients')
export class StampClientEntity implements IStampClients {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClientEntity, { nullable: false, onUpdate:'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @ManyToOne(() => StampsEntity, { nullable: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stamp_id' })
  stamp: StampsEntity;  

  @Column({ nullable: false })
  obtained_at: Date;

  @Column({ nullable: false })
  coffecoins_earned: number;

  @Column({ nullable: false, default: 1 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
