import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { CreateReviewDto } from '../../dto/reviews/create-review.dto';
import { IReview } from 'src/modules/stores/domain/models/review.interface';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IReviewRepository,
  IReviewRepositoryToken,
} from 'src/modules/stores/domain/repositories/review.repository.interface';
import { GetClientByUserUseCase } from 'src/modules/users/application/use-cases/clients/get-client-by-user.use-case';
import { GetBranchUseCase } from '../branches/get-branch.use-case';
import { AddCoffeeCoinsToClientUseCase } from 'src/modules/users/application/use-cases/clients/add-coffee-coins.use-case';
import { CalculateAverageRatingUseCase } from '../branches/calculate-average-rating.use-case';

@Injectable()
export class CreateReviewUseCase implements IUseCase<CreateReviewDto, IReview> {
  constructor(
    @Inject(IReviewRepositoryToken)
    private readonly reviewRepository: IReviewRepository,
    private readonly getBranchUseCase: GetBranchUseCase,
    private readonly getClientByUserUseCase: GetClientByUserUseCase,
    private readonly addCoffeeCoinsUseCase: AddCoffeeCoinsToClientUseCase,
    private readonly calculateAverageRatingUseCase: CalculateAverageRatingUseCase,
  ) {}

  async execute(data: CreateReviewDto): Promise<IReview> {
    const { branchId, userId, rating, comment, imageUrls } = data;

    const branch = await this.getBranchUseCase.execute(branchId);
    if (!branch) throw new NotFoundException('Branch not found');

    const client = await this.getClientByUserUseCase.execute(userId);
    if (!client) throw new NotFoundException('Client not found');

    const review = await this.reviewRepository.create({
      branch,
      client,
      rating,
      comment,
      image_urls: imageUrls,
    });

    if (!review) throw new ConflictException('Error creating review');

    if (comment) {
      const addCoins = await this.addCoffeeCoinsUseCase.execute({
        clientId: client.id,
        quantity: 5,
      });
      if (!addCoins) throw new ConflictException('Error adding coffee coins');
    }

    await this.calculateAverageRatingUseCase.execute(branch.id);
    return review;
  }
}
