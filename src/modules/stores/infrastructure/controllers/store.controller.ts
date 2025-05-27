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
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateStoreDto } from '../../application/dto/stores/create-store.dto';
import { ListStoreDto } from '../../application/dto/stores/list-store.dto';
import { StoreRenponseDto } from '../../application/dto/stores/store-response.dto';
import {
  IStoreServiceToken,
  IStoreService,
} from '../../domain/store.services.interfaces';

@ApiTags('Stores')
@Controller('stores')
export class StoreController {
  constructor(
    @Inject(IStoreServiceToken)
    private readonly storeService: IStoreService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({ status: 201, description: 'Store created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateStoreDto })
  async create(@Body() storeData: CreateStoreDto) {
    try {
      const store = await this.storeService.createStore(storeData);

      return {
        message: 'Store created successfully',
        store: store,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all stores' })
  @ApiResponse({ status: 200, description: 'Stores fetched successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    try {
      const stores = await this.storeService.findAllStores();

      return {
        message: 'Stores fetched successfully',
        stores: new ListStoreDto(stores),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a store by id' })
  @ApiResponse({ status: 200, description: 'Store fetched successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findById(@Param('id', new ParseIntPipe()) id: number) {
    try {
      const store = await this.storeService.findStoreById(id);

      return {
        message: 'Store fetched successfully',
        store,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get('status/:status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get stores by status' })
  @ApiResponse({ status: 200, description: 'Stores fetched successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findByStatus(@Param('status') status: string) {
    try {
      const stores = await this.storeService.findStoreByStatus(status);

      return new ListStoreDto(stores);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Patch('/status/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve or reject a store' })
  @ApiResponse({ status: 200, description: 'Store updated successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async approveOrRejectStore(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: { status: boolean; reason?: string },
  ) {
    try {
      const store = await this.storeService.updateStoreStatus(
        id,
        body.status,
        body.reason,
      );

      return {
        message: 'Store updated successfully',
        store,
      };
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
