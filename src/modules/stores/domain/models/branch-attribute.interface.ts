import { IAttribute } from './attributes.interface';
import { IBranches } from './branches.interface';

export interface IBranchAttribute {
  id: number;
  branch: IBranches;
  attribute: IAttribute;
  value?: string;
}
