import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IStoreService,
  IStoreServiceToken,
} from '../../domain/store.services.interfaces';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import { CreateRecommendationDto } from '../../application/dto/recommendation/create-recomendation.dto';
import { CurrentUser } from 'src/modules/auth/infrastructure/decorators/current-user.decorator';
import { IRecommendation } from '../../domain/models/recommendations.interface';
import { ListRecommendationsDto } from '../../application/dto/recommendation/list-recomendation.dto';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { ResponseRecommendationDto } from '../../application/dto/recommendation/response-recommendation.dto';

@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommendationController {
  constructor(
    @Inject(IStoreServiceToken)
    private readonly storeService: IStoreService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS, Role.CLIENT)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new recommendation' })
  @ApiResponse({
    status: 201,
    description: 'Recommendation created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Recommendation not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createRecommendation(
    @CurrentUser() user,
    @Body() data: CreateRecommendationDto,
  ) {
    try {
      const recommendation = await this.storeService.createRecomedation(
        user,
        data,
      );
      return ResponseRecommendationDto.toResponse(recommendation);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all recommendations' })
  @ApiResponse({
    status: 200,
    description: 'List of all recommendations',
    type: [ListRecommendationsDto],
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async listRecommendations() {
    try {
      const recommendations = await this.storeService.listRecommendations();
      return new ListRecommendationsDto(recommendations);
    } catch (error) {
      this.handleError(error);
      return { recommendations: [] };
    }
  }

  @Get(':userId')
  @ApiOperation({ summary: 'List recommendations by user ID' })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'ID of the user associated with the client',
    example: 5,
  })
  @ApiResponse({status: 200,description: 'List of found recommendations' })
  @ApiResponse({ status: 404, description:'No recommendations found for the given user or user not found'})
  @ApiResponse({status: 500,description: 'Internal server error'})
  async listByUser(@Param('userId', ParseIntPipe) userId: number) {
    const recommendations = await this.storeService.listRecommendationsByUserId(userId);
    return new ListRecommendationsDto(recommendations);
  }

  private handleError(error: any) {
    console.error('Error:', error);
    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
