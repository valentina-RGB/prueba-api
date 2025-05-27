import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IBranchRepositoryToken,
  IBranchesRepository,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';
import { GetReviewByBranchUseCase } from '../reviews/get-review-by-branch.use-case';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';

@Injectable()
export class CalculateAverageRatingUseCase implements IUseCase<number, void> {
  constructor(
    @Inject(IBranchRepositoryToken)
    private readonly branchRepository: IBranchesRepository,
    private readonly getReviewsByBranchUseCase: GetReviewByBranchUseCase,
  ) {}

  async execute(branchId: number) {
    const branch = await this.branchRepository.findById(branchId);
    if (!branch) throw new NotFoundException('Branch not found');

    const reviews = await this.getReviewsByBranchUseCase.execute(branchId);

    if (!reviews || reviews.length === 0) {
      branch.average_rating = 0;
    } else {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0,
      );
      branch.average_rating = totalRating / reviews.length;
    }

    await this.branchRepository.update(branch.id, branch);
  }
}
