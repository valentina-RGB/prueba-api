import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';

import {
  IStoreRepositoryToken,
  IStoreRepository,
} from '../../../domain/repositories/store.repository.interface';
import { IStore } from 'src/modules/stores/domain/models/store.interface';

@Injectable()
export class ListStoreUseCase implements IUseCase<void, IStore[]> {
  constructor(
    @Inject(IStoreRepositoryToken)
    private readonly StoreRepository: IStoreRepository,
  ) {}

  async execute(): Promise<IStore[]> {
    return await this.StoreRepository.findAll();
  }
}
