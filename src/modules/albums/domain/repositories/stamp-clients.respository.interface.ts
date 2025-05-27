import { ICreateStampClientDto, } from '../dto/stamp-client.dto.interface';
import { IStampClients } from '../models/stamp-clients.interface';

export interface IStampClientsRepository {
  findAllStampByClient(id: number): Promise<IStampClients[] | null>;
  findStampClientById(stampId: number, clientId: number): Promise<IStampClients | null>;
  create(data: ICreateStampClientDto): Promise<IStampClients>;
  updateQuantity(stampClientId: number, quantity: number): Promise<IStampClients>;
}

export const IStampClientsRepositoryToken = 'IStampClientsRepositoryToken';