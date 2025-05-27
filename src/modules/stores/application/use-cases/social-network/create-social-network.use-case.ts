import { Inject, ConflictException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { ISocialNetwork } from 'src/modules/stores/domain/models/social-network.interface';
import {
  ISocialNetworkRepositoryToken,
  ISocialNetworkRepository,
} from 'src/modules/stores/domain/repositories/social-network.repository.interface';
import { ListSocialNetworkUseCase } from './list-social-network.use-case';
import { CreateSocialNetworkDto } from '../../dto/social-Network/create-social-network.dto';

export class CreateSocialNetworkUseCase
  implements IUseCase<CreateSocialNetworkDto, ISocialNetwork>
{
  constructor(
    @Inject(ISocialNetworkRepositoryToken)
    private readonly socialRepository: ISocialNetworkRepository,
    private readonly listsocialRepository: ListSocialNetworkUseCase,
  ) {}

  async execute(socialData: CreateSocialNetworkDto): Promise<ISocialNetwork> {
    const social = await this.listsocialRepository.execute();
    const existingSocial = social.find(
      (store) => store.name === socialData.name,
    );
    if (existingSocial) {
      throw new ConflictException('Social Network already exists');
    }

    const newSocial = await this.socialRepository.create(socialData);

    return newSocial;
  }
}
