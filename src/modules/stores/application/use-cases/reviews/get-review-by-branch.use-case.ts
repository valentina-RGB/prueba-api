import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IReview } from 'src/modules/stores/domain/models/review.interface';
import {
  IReviewRepository,
  IReviewRepositoryToken,
} from 'src/modules/stores/domain/repositories/review.repository.interface';
import { GetBranchUseCase } from '../branches/get-branch.use-case';

@Injectable()
export class GetReviewByBranchUseCase implements IUseCase<number, IReview[]> {
  constructor(
    @Inject(IReviewRepositoryToken)
    private readonly reviewRepository: IReviewRepository,
    private readonly getBranchById: GetBranchUseCase,
  ) {}

  async execute(branchId: number): Promise<IReview[]> {
    const branch = await this.getBranchById.execute(branchId);
    if (!branch) throw new NotFoundException('Branch not found');

    const reviews = await this.reviewRepository.findAllByBranchId(branchId);
    if (!reviews || reviews.length === 0)
      throw new NotFoundException('No reviews found for this branch');

    return reviews;
  }
}
