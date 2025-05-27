import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { IAlbumRepository } from '../../domain/repositories/album.repository.interface';
import { CreateAlbumDto } from 'src/modules/albums/application/dto/album/create-album.dto';
import { IAlbum } from '../../domain/models/album.interface';
import { AlbumEntity } from 'src/modules/albums/infrastructure/entities/Album.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class AlbumRepository implements IAlbumRepository {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
  ) {}

  async findAll(): Promise<IAlbum[]> {
    return this.albumRepository.find();
  }

  async findById(id: number): Promise<IAlbum | null> {
    return this.albumRepository.findOne({ where: { id } });
  }

  async findAlbumsByClient(clientId: number): Promise<IAlbum[]> {
    return this.albumRepository
      .createQueryBuilder('album')
      
      .leftJoin('album.event', 'event')
      .leftJoin('event.event_client', 'eventClient')
      .leftJoin('eventClient.client', 'client')

      .where('album.type = :annual', { annual: 'ANNUAL' })
      .orWhere(
        `album.type = :event
         AND client.id = :clientId`,
        { event: 'EVENT', clientId },
      )
      .getMany();
  }

  async create(album: CreateAlbumDto): Promise<IAlbum> {
    return this.albumRepository.save(album);
  }

  async findAnnualByYear(year: number): Promise<IAlbum | null> {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);

    return this.albumRepository.findOne({
      where: {
        type: 'ANNUAL',
        start_date: LessThanOrEqual(endOfYear),
        end_date: MoreThanOrEqual(startOfYear),
      },
      relations: ['pages'],
    });
  }
}
