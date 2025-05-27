import { ICreatePageDto, IUpdatePageDto } from '../dto/page.dto.interface';
import { IPage } from '../models/page.interface';

export interface IPageRepository {
  create(data: ICreatePageDto): Promise<IPage>;
  findAll(albumId: number): Promise<IPage[]>;
  findById(id: number): Promise<IPage | null>;
  getLastPageNumber(albumId: number): Promise<number>;
  update(id: number, data: IUpdatePageDto): Promise<IPage | null>;
}

export const IPageRepositoryToken = Symbol('IPageRepository');
