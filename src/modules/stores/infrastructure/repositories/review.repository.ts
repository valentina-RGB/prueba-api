import { Injectable } from '@nestjs/common';
import {
  ICreateReviewDto,
  IUpdateReviewDto,
} from '../../domain/dto/review.interface.dto';
import { IReview } from '../../domain/models/review.interface';
import { IReviewRepository } from '../../domain/repositories/review.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from '../entities/review.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewEntityRepository: Repository<ReviewEntity>,
  ) {}

  findAllByBranchId(branchId: number): Promise<IReview[] | null> {
    return this.reviewEntityRepository.find({
      where: { branch: { id: branchId } },
      relations: ['branch', 'client', 'client.person'],
    });
  }
  findAllByClientId(clientId: number): Promise<IReview[] | null> {
    return this.reviewEntityRepository.find({
      where: { client: { id: clientId } },
      relations: ['branch', 'client', 'client.person'],
    });
  }
  create(review: ICreateReviewDto): Promise<IReview> {
    return this.reviewEntityRepository.save(review as DeepPartial<ReviewEntity>);
  }

  update(review: IUpdateReviewDto): Promise<IReview> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
