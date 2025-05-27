import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { ISocialNetwork } from 'src/modules/stores/domain/models/social-network.interface';
import {
  ISocialNetworkRepository,
  ISocialNetworkRepositoryToken,
} from 'src/modules/stores/domain/repositories/social-network.repository.interface';

@Injectable()
export class ListSocialNetworkUseCase
  implements IUseCase<void, ISocialNetwork[]>
{
  constructor(
    @Inject(ISocialNetworkRepositoryToken)
    private readonly socialRepository: ISocialNetworkRepository,
  ) {}

  async execute(): Promise<ISocialNetwork[]> {
    return await this.socialRepository.findAll();
  }
}
