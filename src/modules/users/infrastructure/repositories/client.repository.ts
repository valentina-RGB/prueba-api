import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { IClient } from '../../domain/models/client.interface';
import { IClientRepository } from '../../domain/repositories/client.repository.interface';
import { ClientEntity } from '../entities/client.entity';
import { IClientCreateDto } from '../../domain/dto/client.dto.interface';

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientEntityRepository: Repository<ClientEntity>,
  ) {}

  async createClient(client: IClientCreateDto): Promise<IClient> {
    try {
      return await this.clientEntityRepository.save(
        client as DeepPartial<ClientEntity>,
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to create client');
    }
  }

  async findById(id: number): Promise<IClient | null> {
    return await this.clientEntityRepository.findOne({
      where: { id },
      relations: ['person', 'person.user'],
    });
  }

  async findByUserId(userId: number): Promise<IClient | null> {
    return await this.clientEntityRepository.findOne({
      where: { person: { user: { id: userId } } },
      relations: ['person', 'person.user'],
    });
  }

  async findAll(): Promise<IClient[]> {
    return await this.clientEntityRepository.find({
      relations: ['person', 'person.user'],
    });
  }

  async addCoffeeCoins(coffeeCoins: any): Promise<IClient> {
    return this.clientEntityRepository.save(coffeeCoins);
  }

  async update(clientId: number, clientData: any): Promise<IClient> {
    await this.clientEntityRepository.update(clientId, clientData);

    const newClient = await this.findById(clientId);
    if (!newClient) throw new NotFoundException('Client not found');

    return newClient;
  }

  withTransaction(manager: EntityManager): IClientRepository {
    return new ClientRepository(manager.getRepository(ClientEntity));
  }
}
