import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  Column,
} from 'typeorm';
import { IClient } from '../../../users/domain/models/client.interface';
import { PeopleEntity } from 'src/modules/users/infrastructure/entities/people.entity';
import { StampClientEntity } from 'src/modules/albums/infrastructure/entities/stamp-clients.entity';
import { ReviewEntity } from 'src/modules/stores/infrastructure/entities/review.entity';
import { RegisterVisitEntity } from 'src/modules/stores/infrastructure/entities/register-visit.entity';
import { EventClientEntity } from 'src/modules/events/infrastructure/entities/event-client.entity';

@Entity('clients')
export class ClientEntity implements IClient {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => PeopleEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'person_id' })
  person: PeopleEntity;

  @Column({ type: 'int', default: 0 })
  coffee_coins: number;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StampClientEntity, (stampClient) => stampClient.client)
  stamp_clients: StampClientEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.client, {
    nullable: true,
  })
  reviews: ReviewEntity[];

  @OneToMany(() => RegisterVisitEntity, (registerVisit) => registerVisit.client)
  register_visits: RegisterVisitEntity[];

  @OneToMany(() => EventClientEntity, (eventClient) => eventClient.client)
  participants: EventClientEntity[];
}