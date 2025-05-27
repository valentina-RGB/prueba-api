import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StampClientEntity } from '../entities/stamp-clients.entity';
import { IStampClientsRepository } from '../../domain/repositories/stamp-clients.respository.interface';
import { IStampClients } from '../../domain/models/stamp-clients.interface';
import { ICreateStampClientDto } from '../../domain/dto/stamp-client.dto.interface';
import { NotFoundException } from '@nestjs/common';

export class StampClientsRepository implements IStampClientsRepository {
  constructor(
    @InjectRepository(StampClientEntity)
    private readonly stampClientsEntityRepository: Repository<StampClientEntity>,
  ) {}

  create(data: ICreateStampClientDto): Promise<IStampClients> {
    return this.stampClientsEntityRepository.save(data as StampClientEntity);
  }

  findStampClientById(stampId: number, clientId: number): Promise<IStampClients | null> {
    return this.stampClientsEntityRepository.findOne({
      where: { stamp: { id: stampId }, client: { id: clientId } },
      relations: ['stamp', 'client'],
    });
  }

  findAllStampByClient(clientId: number): Promise<IStampClients[]> {
    return this.stampClientsEntityRepository.find({
      where: { client: { id: clientId } },
      relations: ['stamp', 'client'],
      order: { id: 'ASC' },
    });
  }

  async updateQuantity(id: number, quantity: number): Promise<IStampClients> {
    const updated = await this.stampClientsEntityRepository.preload({ id, quantity });
    if (!updated) throw new NotFoundException('Stamp client not found');
    return this.stampClientsEntityRepository.save(updated);
  }
}
