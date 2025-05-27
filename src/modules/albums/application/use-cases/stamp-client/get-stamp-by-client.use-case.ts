import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IStampClients } from 'src/modules/albums/domain/models/stamp-clients.interface';
import {
  IStampClientsRepository,
  IStampClientsRepositoryToken,
} from 'src/modules/albums/domain/repositories/stamp-clients.respository.interface';
import { GetClientByUserUseCase } from 'src/modules/users/application/use-cases/clients/get-client-by-user.use-case';

@Injectable()
export class GetStampByClientUseCase
  implements IUseCase<number, IStampClients[] | null>
{
  constructor(
    @Inject(IStampClientsRepositoryToken)
    private readonly stampClientsRepository: IStampClientsRepository,
    private readonly getClientByUser: GetClientByUserUseCase,
  ) {}

  async execute(userId: number): Promise<IStampClients[] | null> {
    if (!userId || isNaN(userId)) {
      throw new NotFoundException('Invalid client ID, client not found');
    }

    const client = await this.getClientByUser.execute(userId);
    if (!client) throw new NotFoundException('Client not found');
    
    const stamps = await this.stampClientsRepository.findAllStampByClient(client.id);

    return stamps || null;
  }
}
