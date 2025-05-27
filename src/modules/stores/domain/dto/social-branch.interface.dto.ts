import { IBranches } from '../models/branches.interface';
import { ISocialNetwork } from '../models/social-network.interface';

export interface ISocialBranchCreateDto {
  branch: IBranches;
  social_network: ISocialNetwork;
  value: string;
  description: string;
}

export interface ISocialBranchForBranchDto{
  social_network_id: number;
  description: string;
  value: string;
}