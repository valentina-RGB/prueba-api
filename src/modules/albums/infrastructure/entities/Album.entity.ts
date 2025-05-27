import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IAlbum } from '../../domain/models/album.interface';
import { PageEntity } from './page.entity';
import { EventEntity } from 'src/modules/events/infrastructure/entities/events.entity';

@Entity('albums')
export class AlbumEntity implements IAlbum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, unique: true, default: '' })
  title: string;

  @Column({ type: 'text', nullable: true })
  logo?: string;

  @Column({ type: 'text' })
  introduction: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'ANNUAL',
  })
  type: string; // 'ANNUAL' | 'EVENT'

  @Column({
    type: 'int',
    name: 'entity_id',
    nullable: true,
  })
  entity_id?: number;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => EventEntity, (event) => event.album, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'entity_id' })
  event?: EventEntity;

  @OneToMany(() => PageEntity, (page) => page.album, { eager: true })
  pages: PageEntity[];
}
