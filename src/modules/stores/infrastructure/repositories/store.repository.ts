import { InjectRepository } from '@nestjs/typeorm';
import { IStoreRepository } from '../../domain/repositories/store.repository.interface';
import { Repository } from 'typeorm';
import { StoreEntity } from '../entities/store.entity';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IStore } from 'src/modules/stores/domain/models/store.interface';
import { IStoreCreateDto } from '../../domain/dto/store.interface.dto';

@Injectable()
export class StoreRepository implements IStoreRepository {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeEntityRepository: Repository<StoreEntity>,
  ) {}

  async create(store: IStoreCreateDto): Promise<IStore> {
    try {
      return await this.storeEntityRepository.save(store);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create store');
    }
  }

  async findById(id: number): Promise<IStore | null> {
    return await this.storeEntityRepository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<IStore[]> {
    return await this.storeEntityRepository.find();
  }

  async findByStatus(data: string): Promise<IStore[]> {
    return await this.storeEntityRepository.find({
      where: { status: data },
    });
  }

  async update(id: number, store: IStore): Promise<IStore> {
    await this.storeEntityRepository.update(id, store);
    const updatedStore = await this.findById(id);
    if (!updatedStore) {
      throw new InternalServerErrorException('Store not found after update');
    }
    return updatedStore;
  }
}
