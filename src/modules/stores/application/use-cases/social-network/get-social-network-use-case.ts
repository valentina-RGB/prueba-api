import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { ISocialNetwork } from 'src/modules/stores/domain/models/social-network.interface';
import {
  ISocialNetworkRepositoryToken,
  ISocialNetworkRepository,
} from 'src/modules/stores/domain/repositories/social-network.repository.interface';

@Injectable()
export class GetSocialNetworkUseCase
  implements IUseCase<number, ISocialNetwork | null>
{
  constructor(
    @Inject(ISocialNetworkRepositoryToken)
    private readonly socialRepository: ISocialNetworkRepository,
  ) {}

  async execute(id: number): Promise<ISocialNetwork | null> {
    const socialNetwork = await this.socialRepository.findById(id);
    if (!socialNetwork) {
      throw new NotFoundException('Social Network not found');
    }
    return socialNetwork;
  }
}
