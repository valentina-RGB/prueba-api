import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IClient } from 'src/modules/users/domain/models/client.interface';
import {
  IClientRepository,
  IClientRepositoryToken,
} from 'src/modules/users/domain/repositories/client.repository.interface';

@Injectable()
export class ToggleClientVerificationUseCase
  implements IUseCase<{ id: number; isVerify: boolean }, IClient>
{
  constructor(
    @Inject(IClientRepositoryToken)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute({
    id,
    isVerify,
  }: {
    id: number;
    isVerify: boolean;
  }): Promise<IClient> {
    const client = await this.clientRepository.findByUserId(id);
    if (!client) throw new NotFoundException('Client not found');

    client.is_verified = isVerify;
    const updatedClient = await this.clientRepository.update(client.id, client);

    return updatedClient;
  }
}
