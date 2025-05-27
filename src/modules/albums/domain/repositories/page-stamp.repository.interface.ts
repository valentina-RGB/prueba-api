import {
  ICreatePageStampsDto,
  IUpdatePageStampsDto,
} from '../dto/page-stamp.dto.interface';
import { IPageStamps } from '../models/page-stamps.interface';

export interface IPageStampsRepository {
  create(data: ICreatePageStampsDto): Promise<IPageStamps>;
  findAll(): Promise<IPageStamps[]>;
  findStampsByPage(pageId: number): Promise<IPageStamps[] | null>;
  update(id: number, data: IUpdatePageStampsDto): Promise<IPageStamps | null>;
}

export const IPageStampsRepositoryToken = Symbol('IPageStampsRepository');