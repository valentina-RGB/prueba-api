import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IPage } from 'src/modules/albums/domain/models/page.interface';
import {
  IPageRepositoryToken,
  IPageRepository,
} from 'src/modules/albums/domain/repositories/page.repository.interface';
import { CreatePageDto } from '../../dto/page/create-page.dto';
import { GetAlbumUseCase } from '../album/get-album.use-case';

@Injectable()
export class CreatePageUseCase implements IUseCase<CreatePageDto, IPage> {
  constructor(
    @Inject(IPageRepositoryToken)
    private readonly pageRepository: IPageRepository,
    private readonly getAlbum: GetAlbumUseCase,
  ) {}

  async execute(data: CreatePageDto): Promise<IPage> {
    const album = await this.getAlbum.execute(data.album_id);
    if (!album) throw new NotFoundException('Album not found');

    // const lastPageNumber = await this.pageRepository.getLastPageNumber(
    //   album.id,
    // );
    // const nextNumber = lastPageNumber + 1;

    const newPage = {
      album,
      // type: data.type,  
      title: data.title,
      // number: nextNumber,
      description: data.description,
      status: data.status,
    };

    return await this.pageRepository.create(newPage);
  }
}
