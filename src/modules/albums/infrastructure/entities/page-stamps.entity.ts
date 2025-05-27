import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IPageStamps } from '../../domain/models/page-stamps.interface';
import { PageEntity } from './page.entity';
import { StampsEntity } from './stamps.entity';

@Entity('page_stamps')
@Unique(['page', 'stamp'])
export class PageStampsEntity implements IPageStamps {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PageEntity, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'page_id' })
  page: PageEntity;

  @ManyToOne(() => StampsEntity, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'stamp_id' })
  stamp: StampsEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
