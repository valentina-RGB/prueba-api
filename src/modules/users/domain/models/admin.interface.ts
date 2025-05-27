import { IPeople } from './people.interface';

export interface IAdministrator {
  id: number;
  person: IPeople;
  admin_type: 'SYSTEM' | 'STORE' | 'BRANCH';
  entity_id?: number;
  createdAt: Date;
  updatedAt: Date;
}
