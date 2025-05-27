import { IClient } from 'src/modules/users/domain/models/client.interface';
import { IBranches } from './branches.interface';

export interface IRecommendation {
  id: number;
  client: IClient;
  branch: IBranches;
  message: string;
}
