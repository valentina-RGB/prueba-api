import { IBranches } from 'src/modules/stores/domain/models/branches.interface';

export interface IStamps {
  id: number;
  branch: IBranches;
  logo: string;
  // type: string; // 'BRANCHES' | 'EVENTS' | 'OTHERS';
  name: string;
  description: string;
  coffeecoins_value: number;
  status: boolean;
}
