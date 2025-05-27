import { EntityManager } from 'typeorm';
import { IClientCreateDto, IClientUpdateDto } from '../dto/client.dto.interface';
import { IClient } from '../models/client.interface';

export interface IClientRepository {
  update(clientId: number, clientData: IClientUpdateDto):Promise <IClient>;
  createClient(data: IClientCreateDto): Promise<IClient>;
  findById(id: number): Promise<IClient | null>;
  findByUserId(userId: number): Promise<IClient | null>;
  findAll(): Promise<IClient[]>;
  addCoffeeCoins(coffeeCoins: IClient): Promise<IClient>;
  withTransaction(manager: EntityManager): IClientRepository;
}

export const IClientRepositoryToken = Symbol('IClientRepository');
