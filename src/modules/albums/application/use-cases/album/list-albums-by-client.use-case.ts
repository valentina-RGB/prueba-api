import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IAlbum } from 'src/modules/albums/domain/models/album.interface';
import {
  IAlbumRepositoryToken,
  IAlbumRepository,
} from 'src/modules/albums/domain/repositories/album.repository.interface';
import { GetClientByUserUseCase } from 'src/modules/users/application/use-cases/clients/get-client-by-user.use-case';

@Injectable()
export class ListAlbumsByClientUseCase implements IUseCase<number, IAlbum[]> {
  constructor(
    @Inject(IAlbumRepositoryToken)
    private readonly albumRepository: IAlbumRepository,
    private readonly getClientByUser: GetClientByUserUseCase,
  ) {}

  async execute(id: number): Promise<IAlbum[]> {
    console.log('User id:', id);
    const client = await this.getClientByUser.execute(id);
    if (!client) throw new NotFoundException(`Client with ID ${id} not found`);

    return await this.albumRepository.findAlbumsByClient(client.id);
  }
}
