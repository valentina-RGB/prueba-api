import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { ICreateStampClientDto } from 'src/modules/albums/domain/dto/stamp-client.dto.interface';
import { IStampClients } from 'src/modules/albums/domain/models/stamp-clients.interface';
import {
  IStampClientsRepository,
  IStampClientsRepositoryToken,
} from 'src/modules/albums/domain/repositories/stamp-clients.respository.interface';
import { GetStampByBranch } from '../stamp/get-stamp-by-branch-id.use-case';
import { GetClientByUserUseCase } from 'src/modules/users/application/use-cases/clients/get-client-by-user.use-case';
import { AddCoffeeCoinsToClientUseCase } from '../../../../users/application/use-cases/clients/add-coffee-coins.use-case';

@Injectable()
export class AddStampToClientUseCase
  implements IUseCase<{ branchId: string; user: any }, IStampClients>
{
  constructor(
    @Inject(IStampClientsRepositoryToken)
    private readonly stampClientsRepository: IStampClientsRepository,
    private readonly getStampByBranch: GetStampByBranch,
    private readonly getClientByUser: GetClientByUserUseCase,
    private readonly addCoffeeCoins: AddCoffeeCoinsToClientUseCase,
  ) {}

  async execute({ branchId, user }): Promise<IStampClients> {
    const stamp = await this.getStampByBranch.execute(branchId);
    if (!stamp) throw new NotFoundException('Stamp not found');

    const client = await this.getClientByUser.execute(user.id);
    if (!client) throw new NotFoundException('Client not found');

    let stampClient = await this.stampClientsRepository.findStampClientById(
      stamp.id,
      client.id,
    );

    if (stampClient) {
      stampClient.quantity += 1;
      const updated = await this.stampClientsRepository.updateQuantity(
        stampClient.id,
        stampClient.quantity,
      );
      if (!updated)
        throw new ConflictException('Error updating stamp quantity');
    } else {
      const newStampClient: ICreateStampClientDto = {
        stamp,
        client,
        obtained_at: new Date(),
        coffecoins_earned: stamp.coffeecoins_value,
      };

      stampClient = await this.stampClientsRepository.create(newStampClient);
      if (!stampClient)
        throw new ConflictException('Error creating stamp client');
    }

    const coinsResult = await this.addCoffeeCoins.execute({
      clientId: client.id,
      quantity: stamp.coffeecoins_value,
    });

    if (!coinsResult) throw new ConflictException('Error adding CoffeeCoins');

    return stampClient;
  }
}
