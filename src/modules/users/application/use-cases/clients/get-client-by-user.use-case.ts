import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IClient } from 'src/modules/users/domain/models/client.interface';
import {
  IClientRepositoryToken,
  IClientRepository,
} from 'src/modules/users/domain/repositories/client.repository.interface';

@Injectable()
export class GetClientByUserUseCase implements IUseCase<number, IClient | null> {
  constructor(
    @Inject(IClientRepositoryToken)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(id: number): Promise<IClient | null> {
    const client = await this.clientRepository.findByUserId(id);

    if (!client) throw new NotFoundException('Client not found');

    return client;
  }
}
