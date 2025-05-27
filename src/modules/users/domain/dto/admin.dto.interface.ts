import { IPeople } from "../models/people.interface";

export interface IAdminCreateDto {
  admin_type: string; // 'SYSTEM' | 'STORE' | 'BRANCH';
  entity_id?: number;
  person: IPeople;
}
