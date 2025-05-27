import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IUseCase } from "src/core/domain/interfaces/use-cases/use-case.interface";
import { IPage } from "src/modules/albums/domain/models/page.interface";
import { IPageRepositoryToken, IPageRepository } from "src/modules/albums/domain/repositories/page.repository.interface";
import { GetAlbumUseCase } from "../album/get-album.use-case";

@Injectable()
export class ListPageUseCase implements IUseCase<number, IPage[]> {
  constructor(
    @Inject(IPageRepositoryToken)
    private readonly pageRepository: IPageRepository,
    private readonly getAlbumUseCase: GetAlbumUseCase
  ) {}

  async execute(albumId: number): Promise<IPage[]> {

    const album = await this.getAlbumUseCase.execute(albumId);
    if (!album) throw new NotFoundException(`Album with ID ${albumId} not found`);
    

    const pages = await this.pageRepository.findAll(albumId);
    if (!pages || pages.length === 0) {
      throw new NotFoundException("No pages found for this album");
    }
    
    return pages;
  }
}