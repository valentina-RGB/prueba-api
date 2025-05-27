import { IStore } from '../models/store.interface';
import { ISocialBranchForBranchDto } from './social-branch.interface.dto';

export interface IBranchesCreateDto {
  store_id: number;
  store?: IStore;
  name: string;
  phone_number: string;
  latitude: number;
  longitude: number;
  address: string;
  average_rating?: number;
  social_branches: ISocialBranchForBranchDto[];
  status?: string; // 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface IBranchesUpdateDto {
  name?: string;
  phone_number?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  average_rating?: number;
  status?: string; // 'PENDING' | 'APPROVED' | 'REJECTED'
}
