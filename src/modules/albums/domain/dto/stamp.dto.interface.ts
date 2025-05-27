import { IBranches } from 'src/modules/stores/domain/models/branches.interface';

export interface ICreateStampDto {
  branch?: IBranches;
  branch_id?: number;
  logo?: string;
  name?: string;
  description?: string;
  coffeecoins_value?: number;
}

export interface IUpdateStampDto {
  branch?: IBranches;
  branch_id?: number;
  logo?: string;
  name?: string;
  description?: string;
  coffeecoins_value?: number;
  status?: boolean;
}
