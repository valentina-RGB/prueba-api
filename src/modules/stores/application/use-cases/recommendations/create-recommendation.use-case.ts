import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { GetStampByClientUseCase } from 'src/modules/albums/application/use-cases/stamp-client/get-stamp-by-client.use-case';
import { GetStampByBranch } from 'src/modules/albums/application/use-cases/stamp/get-stamp-by-branch-id.use-case';
import { IRecommendation } from 'src/modules/stores/domain/models/recommendations.interface';
import {
  IRecommendationRepository,
  IRecommendationRepositoryToken,
} from 'src/modules/stores/domain/repositories/recommendation.repository.interface';
import { GetClientByUserUseCase } from 'src/modules/users/application/use-cases/clients/get-client-by-user.use-case';
import { GetBranchUseCase } from '../branches/get-branch.use-case';
import { CreateRecommendationDto } from '../../dto/recommendation/create-recomendation.dto';
import { AddCoffeeCoinsToClientUseCase } from 'src/modules/users/application/use-cases/clients/add-coffee-coins.use-case';

@Injectable()
export class CreateRecommendationUseCase
  implements IUseCase<{}, IRecommendation>
{
  constructor(
    @Inject(IRecommendationRepositoryToken)
    private readonly recommendationRepository: IRecommendationRepository,
    private readonly getStampsByBranch: GetStampByBranch,
    private readonly getStampByClient: GetStampByClientUseCase,
    private readonly getClientByUserId: GetClientByUserUseCase,
    private readonly getBranch: GetBranchUseCase,
    private readonly addCoffecoins: AddCoffeeCoinsToClientUseCase
  ) {}

  async execute({ 
        user, 
        data 
    }: { 
        user: any; 
        data: CreateRecommendationDto 
    }): Promise<IRecommendation>{
    const client = await this.getClientByUserId.execute(user.id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if(client.is_verified !== true ){
        throw new BadRequestException('The client must be verified to make a recommendation')
    }

    const branch = await this.getBranch.execute(data.branch_id);
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    const branchStamps = await this.getStampsByBranch.execute(data.branch_id);
    if (!branchStamps) {
      throw new NotFoundException(`Branch with ID ${data.branch_id} not found`);
    }

    const clientStamps = await this.getStampByClient.execute(user.id);
    if (!clientStamps || clientStamps.length === 0) {
      throw new BadRequestException(
        `Client ${client.person.full_name} does not have any stamps yet`,
      );
    }

    const hasStampFromBranch = clientStamps.some(
      (clientStamp) => clientStamp.stamp.branch.id === data.branch_id,
    );
    if (!hasStampFromBranch) {
      throw new BadRequestException(
        `Client ${client.person.full_name} does not have stamps from branch ${branch.name}`,
      );
    }
    const recommendation = await this.recommendationRepository.create({
      client,
      branch,
      message: data.message,
    });

    await this.addCoffecoins.execute({ id: client.id, quantity: 3 });

    return recommendation;
  }
}
