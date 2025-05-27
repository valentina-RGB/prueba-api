import { ApiProperty } from '@nestjs/swagger';
import { ResponseRecommendationDto } from './response-recommendation.dto';

export class ListRecommendationsDto {
  @ApiProperty({ type: [ResponseRecommendationDto],  description: 'List of recommendations' })
  recommendations: ResponseRecommendationDto[];

  constructor(recommendations: any[]) {
    this.recommendations = recommendations.map((recommendation) =>
      ResponseRecommendationDto.toResponse(recommendation),
    );
  }
}
