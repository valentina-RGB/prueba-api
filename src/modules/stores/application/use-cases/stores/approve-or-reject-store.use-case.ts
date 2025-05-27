import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { StoreRepository } from 'src/modules/stores/infrastructure/repositories/store.repository';
import { IStore } from 'src/modules/stores/domain/models/store.interface';
import { IStoreRepositoryToken } from 'src/modules/stores/domain/repositories/store.repository.interface';
import { SendStoreApprovedEmailUseCase } from 'src/modules/mailer/application/use-cases/send-branch-approved.use-case';
import { SendStoreRejectionEmailUseCase } from 'src/modules/mailer/application/use-cases/send-branch-rejection.use-case';

@Injectable()
export class ApproveOrRejectStoreUseCase
  implements
    IUseCase<{ id: number; data: boolean; reason?: string }, IStore | null>
{
  constructor(
    @Inject(IStoreRepositoryToken)
    private readonly storeRepository: StoreRepository,
    private sendStoreApprovedEmailUseCase: SendStoreApprovedEmailUseCase,
    private sendStoreRejectionEmailUseCase: SendStoreRejectionEmailUseCase,
  ) {}

  async execute({
    id,
    data,
    reason,
  }: {
    id: number;
    data: boolean;
    reason?: string;
  }): Promise<IStore | null> {
    const store = await this.storeRepository.findById(id);
    if (!store) throw new NotFoundException('Store not found');

    store.status = data ? 'APPROVED' : 'REJECTED';
    await this.storeRepository.update(id, store);

    // if (data) {
    //   await this.sendStoreApprovedEmailUseCase.execute(store);
    // } else {
    //   await this.sendStoreRejectionEmailUseCase.execute(store, reason!);
    // }

    return store;
  }
}
