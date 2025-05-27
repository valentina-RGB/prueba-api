import { ISocialNetworkCreateDto } from '../dto/social-network.interface.dto';
import { ISocialNetwork } from '../models/social-network.interface';

export interface ISocialNetworkRepository {
  findAll(): Promise<ISocialNetwork[]>;
  findById(id: number): Promise<ISocialNetwork | null>;
  create(socialNetwork: ISocialNetworkCreateDto): Promise<ISocialNetwork>;
}

export const ISocialNetworkRepositoryToken = Symbol('ISocialNetworkRepository');
