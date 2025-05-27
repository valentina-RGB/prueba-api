import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { IPeople } from '../models/people.interface';

export interface IEmployeeCreateDto {
  employee_type: string;
  person?: IPeople;
  branch?: IBranches;
}