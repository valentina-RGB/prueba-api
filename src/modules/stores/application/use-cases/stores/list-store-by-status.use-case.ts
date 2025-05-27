import { Inject } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IStore } from 'src/modules/stores/domain/models/store.interface';
import {
  IStoreRepositoryToken,
  IStoreRepository,
} from 'src/modules/stores/domain/repositories/store.repository.interface';

export class ListStoreByStatusUseCase implements IUseCase<string, IStore[]> {
  constructor(
    @Inject(IStoreRepositoryToken)
    private readonly storeRepository: IStoreRepository,
  ) {}

  async execute(status: string): Promise<IStore[]> {
    return await this.storeRepository.findByStatus(status);
  }
}
