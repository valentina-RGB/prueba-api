import { Inject, NotFoundException } from '@nestjs/common';
import {
  IClientRepositoryToken,
  IClientRepository,
} from 'src/modules/users/domain/repositories/client.repository.interface';
import { UpdatePersonDto } from '../../dto/people/update-people.dto';
import { UpdatePeopleUseCase } from '../people/update-people.use-case';
import { IClient } from 'src/modules/users/domain/models/client.interface';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';

export class UpdateClientUseCase
  implements
    IUseCase<{ userId: number; personData: UpdatePersonDto }, IClient>
{
  constructor(
    @Inject(IClientRepositoryToken)
    private readonly clientRepository: IClientRepository,
    private readonly updatePersonUseCase: UpdatePeopleUseCase,
  ) {}

  async execute({
    userId,
    personData,
  }: {
    userId: number;
    personData: UpdatePersonDto;
  }): Promise<IClient> {
    const client = await this.clientRepository.findByUserId(userId);
    if (!client) throw new NotFoundException('Client not found');

    if (Object.keys(personData).length === 0)
      throw new NotFoundException('No data to update');

    await this.updatePersonUseCase.execute({
      id: client.person.id,
      data: personData,
    });

    const updatedClient = await this.clientRepository.findById(client.id);

    return updatedClient!;
  }
}
