import { IStore } from './store.interface';

export interface IBranches {
  id: number;
  store: IStore;
  name: string;
  phone_number: string;
  latitude: number;
  longitude: number;
  address: string;
  average_rating?: number;
  status: string; // 'PENDING' | 'APPROVED' | 'REJECTED'
  is_open: boolean;
  createdAt: Date;
  updatedAt: Date;
}
