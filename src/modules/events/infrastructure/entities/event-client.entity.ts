import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IEventClient } from '../../domain/models/event-clients.interface';
import { IClient } from 'src/modules/users/domain/models/client.interface';
import { IEvent } from '../../domain/models/events.interface';
import { EventEntity } from './events.entity';
import { ClientEntity } from 'src/modules/users/infrastructure/entities/client.entity';

@Entity('event_client')
export class EventClientEntity implements IEventClient {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => EventEntity, (event) => event.event_client, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: IEvent;

  @ManyToOne(() => ClientEntity, (client) => client.participants, {
    eager: true, onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'client_id' })
  client: IClient;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
