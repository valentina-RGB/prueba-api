import { Injectable } from '@nestjs/common';
import { IAlbumService } from '../domain/album.service.interface';
import {
  ICreatePageDto,
  IUpdatePageDto,
} from '../domain/dto/page.dto.interface';
import { IAlbum } from '../domain/models/album.interface';
import { IPageStamps } from '../domain/models/page-stamps.interface';
import { IPage } from '../domain/models/page.interface';
import { IStamps } from '../domain/models/stamps.interface';
import { CreateAlbumUseCase } from './use-cases/album/create-album.use-case';
import { GetAlbumUseCase } from './use-cases/album/get-album.use-case';
import { ListAlbumUseCase } from './use-cases/album/list-album.use-case';
import { ListPageUseCase } from './use-cases/page/list-page.use-case';
import { CreateStampUseCase } from './use-cases/stamp/create-stamp.use-case';
import { ListStampUseCase } from './use-cases/stamp/list-stamp.use-case';
import { CreateStampDto } from './dto/stamp/create-stamp.dto';
import { CreatePageUseCase } from './use-cases/page/create-page.use-case';
import { CreatePageDto } from './dto/page/create-page.dto';
import { GetStampUseCase } from './use-cases/stamp/get-stamp.use-case';
import {
  CreatePageStampsDto,
  PartialPageStampCreationResult,
} from './dto/page-stamp/create-page-stamp.dto';
import { CreatePageStampUseCase } from './use-cases/page-stamps/create-page-stamp.use-case';
import { GetStampsByPageIdUseCase } from './use-cases/page-stamps/get-stamps-by-page.use-case';
import { GetPageUseCase } from './use-cases/page/get-page.use-case';
import { GetStampByClientUseCase } from './use-cases/stamp-client/get-stamp-by-client.use-case';
import { IStampClients } from '../domain/models/stamp-clients.interface';
import { UpdateStampUseCase } from './use-cases/stamp/update-stamp.use-case';
import { IUpdateStampDto } from '../domain/dto/stamp.dto.interface';
import { ListAlbumsByClientUseCase } from './use-cases/album/list-albums-by-client.use-case';

@Injectable()
export class AlbumService implements IAlbumService {
  constructor(
    //Album
    private readonly createAlbumUseCase: CreateAlbumUseCase,
    private readonly getAlbumUseCase: GetAlbumUseCase,
    private readonly listAlbumUseCase: ListAlbumUseCase,
    private readonly listAlbumsByClient: ListAlbumsByClientUseCase,

    // Page
    private readonly listPageUseCase: ListPageUseCase,
    private readonly getPageUseCase: GetPageUseCase,
    private readonly createPageUseCase: CreatePageUseCase,

    //stamps
    private readonly createStampUseCase: CreateStampUseCase,
    private readonly listStampUseCase: ListStampUseCase,
    private readonly getStampUseCase: GetStampUseCase,
    private readonly updateStampUseCase: UpdateStampUseCase,

    //StampClients
    private readonly getStampByClientIdUseCase: GetStampByClientUseCase,

    // PageStamps
    private readonly createPageStampUseCase: CreatePageStampUseCase,
    private readonly listStampsByPageUseCase: GetStampsByPageIdUseCase,
  ) {}
  // ----------------------ALBUM-------------------------------
  createAlbum(data: any): Promise<IAlbum> {
    return this.createAlbumUseCase.execute(data);
  }

  getAlbum(id: number): Promise<IAlbum | null> {
    return this.getAlbumUseCase.execute(id);
  }

  listAlbums(): Promise<IAlbum[]> {
    return this.listAlbumUseCase.execute();
  }

  getAlbumsByClientId(id: number): Promise<IAlbum[]> {
    return this.listAlbumsByClient.execute(id);
  }
  
  updateAlbum(id: number, data: any): Promise<IAlbum | null> {
    throw new Error('Method not implemented.');
  }

  // ----------------------PAGE-------------------------------
  createPage(data: CreatePageDto): Promise<IPage> {
    return this.createPageUseCase.execute(data);
  }
  getPage(id: number): Promise<IPage | null> {
    return this.getPageUseCase.execute(id);
  }
  listPages(albumId: number): Promise<IPage[]> {
    return this.listPageUseCase.execute(albumId);
  }
  updatePage(id: number, data: IUpdatePageDto): Promise<IPage | null> {
    throw new Error('Method not implemented.');
  }

  // ----------------------STAMPS-------------------------------
  createStamp(data: CreateStampDto): Promise<IStamps> {
    return this.createStampUseCase.execute(data);
  }

  listStamps(): Promise<IStamps[]> {
    return this.listStampUseCase.execute();
  }

  getStamp(id: number): Promise<IStamps | null> {
    return this.getStampUseCase.execute(id);
  }

  updateStamp(id: number, data: IUpdateStampDto): Promise<IStamps | null> {
    return this.updateStampUseCase.execute({ id, data });
  }

  // ---------------------PAGE_STAMPS--------------------------
  addStampsToPage(
    data: CreatePageStampsDto,
  ): Promise<PartialPageStampCreationResult> {
    return this.createPageStampUseCase.execute(data);
  }

  getStampsByPage(pageId: number): Promise<IPageStamps[]> {
    return this.listStampsByPageUseCase.execute(pageId);
  }

  // ---------------------CLIENT_STAMPS-------------------------
  addStampsToClient(clientId: number, stampIds: number[]): Promise<any> {
    throw new Error('Method not implemented.');
  }

  getStampsByClient(userId: number): Promise<IStampClients[] | null> {
    return this.getStampByClientIdUseCase.execute(userId);
  }

}
