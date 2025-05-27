import {
  ICreateReviewDto,
  IUpdateReviewDto,
} from '../dto/review.interface.dto';
import { IReview } from '../models/review.interface';

export interface IReviewRepository {
  findAllByBranchId(branchId: number): Promise<IReview[] | null>;
  findAllByClientId(clientId: number): Promise<IReview[] | null>;
  create(review: ICreateReviewDto): Promise<IReview>;
  update(review: IUpdateReviewDto): Promise<IReview>;
  delete(id: number): Promise<void>;
}

export const IReviewRepositoryToken = Symbol('IReviewRepository');
