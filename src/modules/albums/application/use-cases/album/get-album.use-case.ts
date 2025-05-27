import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IAlbum } from 'src/modules/albums/domain/models/album.interface';
import {
  IAlbumRepositoryToken,
  IAlbumRepository,
} from 'src/modules/albums/domain/repositories/album.repository.interface';

@Injectable()
export class GetAlbumUseCase implements IUseCase<number, IAlbum | null> {
  constructor(
    @Inject(IAlbumRepositoryToken)
    private readonly albumRepository: IAlbumRepository,
  ) {}

  async execute(id: number): Promise<IAlbum | null> {
    const album = await this.albumRepository.findById(id);
    if (!album) throw new NotFoundException(`Album with ID ${id} not found`);
    
    return album;
  }
}
