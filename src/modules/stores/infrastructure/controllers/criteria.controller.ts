import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  IStoreServiceToken,
  IStoreService,
} from '../../domain/store.services.interfaces';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';

@ApiTags('Criteria')
@Controller('criteria')
export class CriteriaController {
  constructor(
    @Inject(IStoreServiceToken)
    private readonly storeService: IStoreService,
  ) {}

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a criteria by id' })
  @ApiResponse({ status: 200, description: 'Criteria fetched successfully' })
  @ApiResponse({ status: 404, description: 'Criteria not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findById(@Param('id', new ParseIntPipe()) id: number) {
    try {
      const criteria = await this.storeService.findCriteriaById(id);

      return {
        message: 'Criteria fetched successfully',
        criteria,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Get('status/:status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get criteria by status' })
  @ApiResponse({ status: 200, description: 'Criteria fetched successfully' })
  @ApiResponse({ status: 404, description: 'Criteria not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findByStatus(@Param('status', ParseBoolPipe) status: boolean) {
    try {
      const criteria = await this.storeService.findAllCriteriaByStatus(status);

      return criteria;
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
