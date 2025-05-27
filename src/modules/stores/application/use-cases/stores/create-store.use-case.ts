import { Inject, ConflictException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';

import {
  IStoreRepositoryToken,
  IStoreRepository,
} from '../../../domain/repositories/store.repository.interface';
import { CreateStoreDto } from '../../dto/stores/create-store.dto';
import { IStore } from 'src/modules/stores/domain/models/store.interface';
import { ListStoreUseCase } from './list-store.use.case';

export class CreateStoreUseCase implements IUseCase<CreateStoreDto, IStore> {
  constructor(
    @Inject(IStoreRepositoryToken)
    private readonly storeRepository: IStoreRepository,
    private readonly listStoreUseCase: ListStoreUseCase,
  ) {}

  async execute(storeData: CreateStoreDto): Promise<IStore> {
    const stores = await this.listStoreUseCase.execute();
    const existingStore = stores.find(
      (store) => store.email === storeData.email,
    );
    if (existingStore) {
      throw new ConflictException('Store email already exists');
    }

    const existingStoreName = stores.find(
      (store) => store.name === storeData.name,
    );
    if (existingStoreName) {
      throw new ConflictException('Store name already exists');
    }

    const newStore = await this.storeRepository.create(storeData);

    if (!newStore) throw new ConflictException('Store already exists');

    return newStore;
  }
}