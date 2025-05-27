import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';

import {
  IStoreRepositoryToken,
  IStoreRepository,
} from '../../../domain/repositories/store.repository.interface';
import { IStore } from 'src/modules/stores/domain/models/store.interface';

@Injectable()
export class GetStoreUseCase implements IUseCase<number, IStore | null> {
  constructor(
    @Inject(IStoreRepositoryToken)
    private readonly StoreRepository: IStoreRepository,
  ) {}

  async execute(id: number): Promise<IStore | null> {
    const Store = await this.StoreRepository.findById(id);
    if (!Store) {
      throw new NotFoundException('Store not found');
    }
    return Store;
  }
}
