import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IAlbum } from 'src/modules/albums/domain/models/album.interface';
import { IAlbumRepositoryToken, IAlbumRepository } from 'src/modules/albums/domain/repositories/album.repository.interface';

@Injectable()
export class ListAlbumUseCase implements IUseCase<void, IAlbum[]> {
  constructor(
    @Inject(IAlbumRepositoryToken)
    private readonly albumRepository: IAlbumRepository,
  ) {}

  async execute(): Promise<IAlbum[]> {
    return await this.albumRepository.findAll();
  }
}