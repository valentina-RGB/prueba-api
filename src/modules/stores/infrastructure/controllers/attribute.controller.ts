import { Controller, Get, HttpCode, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IStoreServiceToken,
  IStoreService,
} from '../../domain/store.services.interfaces';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import { ListAttributesDto } from '../../application/dto/attributes/reponse-attribute.dto';

@ApiTags('Attributes')
@Controller('attributes')
export class AttributeController {
  constructor(
    @Inject(IStoreServiceToken)
    private readonly storeService: IStoreService,
  ) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all attributes' })
  @ApiResponse({ status: 200, description: 'Attributes fetched succesfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAttributes() {
    try {
      const attributes = await this.storeService.findAllAttributes();

      return new ListAttributesDto(attributes);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
