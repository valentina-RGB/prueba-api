import { IPage } from '../models/page.interface';
import { IStamps } from '../models/stamps.interface';

export interface ICreatePageStampsDto {
  page?: IPage;
  stamp?: IStamps;
}

export interface IUpdatePageStampsDto {
  page?: IPage;
  stamp?: IStamps;
}
