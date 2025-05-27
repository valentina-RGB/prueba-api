import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IStoreServiceToken,
  IStoreService,
} from '../../domain/store.services.interfaces';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { CreateReviewDto } from '../../application/dto/reviews/create-review.dto';
import { ResponseReviewDto } from '../../application/dto/reviews/response-review.dto';
import { ListReviewsByBranchDto } from '../../application/dto/reviews/list-reviews-by-branch.dto';
import { ListReviewsByClientDto } from '../../application/dto/reviews/list-reviews-by-client.dto';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(
    @Inject(IStoreServiceToken)
    private readonly storeService: IStoreService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS, Role.CLIENT)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateReviewDto })
  async create(@Body() reviewData: CreateReviewDto) {
    try {
      const review = await this.storeService.createReview(reviewData);

      return new ResponseReviewDto(review);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Get('branch/:branchId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get reviews by branch ID' })
  @ApiResponse({ status: 200, description: 'Reviews fetched successfully' })
  @ApiResponse({ status: 404, description: 'No reviews found for this branch' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getReviewsByBranchId(@Param('branchId') branchId: number) {
    try {
      const reviews =
        await this.storeService.findAllReviewsByBranchId(branchId);
      return new ListReviewsByBranchDto(reviews);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Get('client/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get reviews by branch ID' })
  @ApiResponse({ status: 200, description: 'Reviews fetched successfully' })
  @ApiResponse({ status: 404, description: 'No reviews found for this branch' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getReviewsByClientId(@Param('id') userId: number) {
    try {
      const reviews = await this.storeService.findAllReviewsByClientId(userId);
      return new ListReviewsByClientDto(reviews);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
