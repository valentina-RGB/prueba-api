import { Injectable, NotFoundException } from '@nestjs/common';
import { IRecommendation } from 'src/modules/stores/domain/models/recommendations.interface';
import {
  IRecommendationRepository,
  IRecommendationRepositoryToken,
} from 'src/modules/stores/domain/repositories/recommendation.repository.interface';

import { Inject } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { GetClientByUserUseCase } from 'src/modules/users/application/use-cases/clients/get-client-by-user.use-case';

@Injectable()
export class ListRecommendationsByUserIdUseCase implements IUseCase<number, IRecommendation[]> {
  constructor(
    @Inject(IRecommendationRepositoryToken)
    private readonly recommendationRepository: IRecommendationRepository,
    private readonly getClientByUserId: GetClientByUserUseCase,
  ) {}

  async execute(userId: number): Promise<IRecommendation[]> {
    const client = await this.getClientByUserId.execute(userId);
    if (!client) {
      throw new   NotFoundException('Client not found');
    }
    return this.recommendationRepository.findByClient(client.id);
  }
}
