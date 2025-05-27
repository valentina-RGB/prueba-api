import { IClient } from 'src/modules/users/domain/models/client.interface';
import { IBranches } from '../models/branches.interface';

export interface ICreateReviewDto {
  branch?: IBranches;
  client?: IClient;
  rating: number;
  comment?: string;
  image_urls?: string[];
}

export interface IUpdateReviewDto {
  rating?: number;
  comment?: string;
  image_urls?: string[];
}
