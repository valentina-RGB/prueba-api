import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IClient } from 'src/modules/users/domain/models/client.interface';
import {
  IClientRepositoryToken,
  IClientRepository,
} from 'src/modules/users/domain/repositories/client.repository.interface';

@Injectable()
export class AddCoffeeCoinsToClientUseCase
  implements IUseCase<{ id: number; quantity: number }, IClient>
{
  constructor(
    @Inject(IClientRepositoryToken)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(data): Promise<IClient> {
    const client = await this.clientRepository.findById(data.id);
    if (!client) throw new NotFoundException('Client not found');

    if (data.quantity <= 0)
      throw new BadRequestException('Quantity must be greater than zero');

    client.coffee_coins += data.quantity;

    const updatedCoins = await this.clientRepository.addCoffeeCoins(client);

    if (!updatedCoins)
      throw new ConflictException('Error updating CoffeeCoins');

    return updatedCoins;
  }
}
