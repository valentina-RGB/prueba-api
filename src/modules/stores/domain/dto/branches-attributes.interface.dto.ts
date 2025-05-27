import { IAttribute } from "../models/attributes.interface";
import { IBranches } from "../models/branches.interface";

export interface ICreateBranchAttribute {
  branch?: IBranches;
  branch_id?: number;
  attribute?: IAttribute;
  attribute_id?: number;
  value?: string;
}

export interface IUpdateBranchAttribute {
  value: string;
}

