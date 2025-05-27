import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IPage } from '../../domain/models/page.interface';
import { AlbumEntity } from './Album.entity';
import { PageStampsEntity } from './page-stamps.entity';

// @Unique(['album', 'number'])
@Entity('pages')
export class PageEntity implements IPage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AlbumEntity, (album) => album.pages, {
    onDelete: 'CASCADE',
  })
  album: AlbumEntity;

  // @Column({ type: 'varchar', length: 30, default: 'BRANCH' })
  // type: string; // 'BRANCHES' | 'EVENTS' | 'OTHERS';

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // @Column({ type: 'int', default: 1 })
  // number_page: number;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PageStampsEntity, (pageStamp) => pageStamp.page)
  page_stamps: PageStampsEntity[];
}
