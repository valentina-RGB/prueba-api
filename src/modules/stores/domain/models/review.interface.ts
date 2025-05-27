import { IClient } from 'src/modules/users/domain/models/client.interface';
import { IBranches } from './branches.interface';

export interface IReview {
  id: number;
  branch: IBranches;
  client: IClient;
  rating: number;
  comment?: string;
  image_urls?: string[];
}
