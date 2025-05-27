import { IAlbum } from '../models/album.interface';
import { CreateAlbumDto } from '../../application/dto/album/create-album.dto';

export interface IAlbumRepository {
  findAll(): Promise<IAlbum[]>;
  findById(id: number): Promise<IAlbum | null>;
  findAlbumsByClient(id: number): Promise<IAlbum[]>;
  create(album: CreateAlbumDto): Promise<IAlbum>;
  findAnnualByYear(year: number): Promise<IAlbum | null>;
}

export const IAlbumRepositoryToken = Symbol('IAlbumRepository');
