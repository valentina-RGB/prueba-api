import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IRecommendationRepository } from '../../domain/repositories/recommendation.repository.interface';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { IRecommendationCreateDto } from '../../domain/dto/recommendation.interface.dto';
import { IRecommendation } from '../../domain/models/recommendations.interface';
import { RecommendationEntity } from '../entities/recommendations.entity';

Injectable();
export class RecommendationRepository implements IRecommendationRepository {
  constructor(
    @InjectRepository(RecommendationEntity)
    private readonly recommendationEntity: Repository<RecommendationEntity>,
  ) {}

  async create(
    recommendation: IRecommendationCreateDto,
  ): Promise<IRecommendation> {
    try {
      const savedRecommendation = await this.recommendationEntity.save(
        recommendation as DeepPartial<RecommendationEntity>,
      );
      return savedRecommendation as IRecommendation;
    } catch (error) {
      console.error('Error creating recommendation:', error);
      throw new InternalServerErrorException('Failed to create recommendation');
    }
  }

  async findAll(): Promise<IRecommendation[]> {
    try {
      return await this.recommendationEntity.find({
        relations: ['client', 'branch'],
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw new InternalServerErrorException('Failed to fetch recommendations');
    }
  }

  async findByClient(id: number): Promise<IRecommendation[]> {
    try {
      return await this.recommendationEntity.find({
        where: { client: { id } },
        relations: ['client', 'branch'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch recommendations by client',
      );
    }
  }
}
