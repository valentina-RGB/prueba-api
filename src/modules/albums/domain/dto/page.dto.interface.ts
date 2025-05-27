import { IAlbum } from '../models/album.interface';

export interface ICreatePageDto {
  album_id?: number;
  album?: IAlbum;
  title: string;
  description: string;
  status?: boolean;
}

export interface IUpdatePageDto {
  album?: IAlbum;
  title?: string;
  description?: string;
  status?: boolean;
}
