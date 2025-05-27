import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IAlbum } from 'src/modules/albums/domain/models/album.interface';
import {
  IAlbumRepositoryToken,
  IAlbumRepository,
} from 'src/modules/albums/domain/repositories/album.repository.interface';

@Injectable()
export class GetAnnualAlbumByYearUseCase
  implements IUseCase<number, IAlbum | null>
{
  constructor(
    @Inject(IAlbumRepositoryToken)
    private readonly albumRepository: IAlbumRepository,
  ) {}

  async execute(year: number): Promise<IAlbum | null> {
    return this.albumRepository.findAnnualByYear(year);
  }
}
