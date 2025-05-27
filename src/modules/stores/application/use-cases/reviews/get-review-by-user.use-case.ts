import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IReview } from 'src/modules/stores/domain/models/review.interface';
import {
  IReviewRepository,
  IReviewRepositoryToken,
} from 'src/modules/stores/domain/repositories/review.repository.interface';
import { GetClientByUserUseCase } from 'src/modules/users/application/use-cases/clients/get-client-by-user.use-case';

@Injectable()
export class GetReviewByClientUseCase implements IUseCase<number, IReview[]> {
  constructor(
    @Inject(IReviewRepositoryToken)
    private readonly reviewRepository: IReviewRepository,
    private readonly getClientByUserUseCase: GetClientByUserUseCase,
  ) {}

  async execute(userId: number): Promise<IReview[]> {
    const client = await this.getClientByUserUseCase.execute(userId);
    if (!client) throw new NotFoundException('Client not found');

    const reviews = await this.reviewRepository.findAllByClientId(client.id);
    if (!reviews || reviews.length === 0)
      throw new NotFoundException('No reviews found for this client');

    return reviews;
  }
}
