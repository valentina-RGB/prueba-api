import { Inject, Injectable } from '@nestjs/common';
import { IRecommendation } from 'src/modules/stores/domain/models/recommendations.interface';
import { IRecommendationRepositoryToken, IRecommendationRepository } from 'src/modules/stores/domain/repositories/recommendation.repository.interface';

@Injectable()
export class ListRecommendationsUseCase {
  constructor(
    @Inject(IRecommendationRepositoryToken)
    private readonly recommendationRepository: IRecommendationRepository,
  ) {}

  async execute(): Promise<IRecommendation[]> {
    return this.recommendationRepository.findAll();
  }
}
