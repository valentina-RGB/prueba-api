import { IClient } from 'src/modules/users/domain/models/client.interface';
import { IStamps } from './stamps.interface';

export interface IStampClients {
  id: number;
  client: IClient;
  stamp: IStamps;
  obtained_at: Date;
  coffecoins_earned: number;
  quantity : number;
}
