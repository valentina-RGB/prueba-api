import { IRecommendationCreateDto } from "../dto/recommendation.interface.dto";
import { IRecommendation } from "../models/recommendations.interface";

export interface IRecommendationRepository {
  create(data: IRecommendationCreateDto): Promise<IRecommendation>;
  findAll(): Promise<IRecommendation[]>;
  findByClient(id: number): Promise<IRecommendation[]>;
}

export const IRecommendationRepositoryToken = Symbol('IRecommendationRepository');
