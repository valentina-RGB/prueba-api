import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { IPeople } from './people.interface';

export interface IEmployee {
  id: number;
  person: IPeople;
  employee_type: string;
  branch: IBranches;
}
