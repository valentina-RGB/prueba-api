import { IClient } from 'src/modules/users/domain/models/client.interface';
import { IBranches } from './branches.interface';

export interface IRegisterVisit {
  id: number;
  branch: IBranches;
  client: IClient;
  visit_date: Date;
}
