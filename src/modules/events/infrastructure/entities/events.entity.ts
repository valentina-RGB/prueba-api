import { AlbumEntity } from 'src/modules/albums/infrastructure/entities/Album.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventBranchEntity } from './event-branches.entity';
import { IEvent } from '../../domain/models/events.interface';
import { EventClientEntity } from './event-client.entity';

@Entity('events')
export class EventEntity implements IEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({ length: 100 })
  location: string;

  @Column({ default: true })
  is_free: boolean;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  value: number;

  @Column({ length: 50 })
  organizer: string;

  @Column({
    type: 'varchar',
    enum: ['PUBLISHED', 'RUNNING', 'FINISHED', 'CANCELLED'],
    default: 'PUBLISHED',
  })
  status: 'PUBLISHED' | 'RUNNING' | 'FINISHED' | 'CANCELLED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => AlbumEntity, (album) => album.event, { cascade: true })
  album: AlbumEntity;

  @OneToMany(() => EventBranchEntity, (eventBranch) => eventBranch.event, {
    cascade: true,
  })
  branches: EventBranchEntity[];

  @OneToMany(() => EventClientEntity, (eventClient) => eventClient.event, {
    cascade: true,
  })
  event_client: EventClientEntity[];
}
