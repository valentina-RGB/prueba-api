import { IAlbum } from './models/album.interface';
import { IPageStamps } from './models/page-stamps.interface';
import { IPage } from './models/page.interface';
import { IStamps } from './models/stamps.interface';

import { ICreatePageDto, IUpdatePageDto } from './dto/page.dto.interface';
import { ICreateStampDto } from './dto/stamp.dto.interface';
import { ICreatePageStampsDto } from './dto/page-stamp.dto.interface';
import { IStampClients } from './models/stamp-clients.interface';

export interface IAlbumService {
  // ----------------------ALBUM-------------------------------
  createAlbum(data: any): Promise<IAlbum>;
  getAlbum(id: number): Promise<IAlbum | null>;
  getAlbumsByClientId(id: number): Promise<IAlbum[]>;
  listAlbums(): Promise<IAlbum[]>;
  updateAlbum(id: number, data: any): Promise<IAlbum | null>;

  // ----------------------PAGE-------------------------------
  createPage(data: ICreatePageDto): Promise<IPage>;
  getPage(id: number): Promise<IPage | null>;
  listPages(albumId: number): Promise<IPage[]>;
  updatePage(id: number, data: IUpdatePageDto): Promise<IPage | null>;

  // ----------------------STAMPS-------------------------------
  createStamp(data: ICreateStampDto): Promise<IStamps>;
  listStamps(): Promise<IStamps[]>;
  getStamp(id: number): Promise<IStamps | null>;
  updateStamp(id: number, data: Partial<IStamps>): Promise<IStamps | null>;

  // ---------------------PAGE_STAMPS--------------------------
  addStampsToPage: (data: ICreatePageStampsDto) => Promise<any>;
  getStampsByPage: (pageId: number) => Promise<IPageStamps[]>;

  // ---------------------CLIENT_STAMPS-------------------------
  addStampsToClient: (clientId: number, stampIds: number[]) => Promise<any>;
  getStampsByClient: (userId: number) => Promise<IStampClients[] | null>;


}

export const IAlbumServiceToken = Symbol('AlbumService');
