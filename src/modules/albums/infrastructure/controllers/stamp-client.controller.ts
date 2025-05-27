import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IAlbumService,
  IAlbumServiceToken,
} from '../../domain/album.service.interface';
import { StampClientResponseDto } from '../../application/dto/stamp-client/stamp-client.response.dto';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';

@ApiTags('Stamps-clients')
@Controller('stamp-clients')
export class StampClientController {
  constructor(
    @Inject(IAlbumServiceToken)
    private readonly stampClientService: IAlbumService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS, Role.CLIENT)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a stamp by client id' })
  @ApiResponse({
    status: 200,
    description: 'Stamps by client ID fetched succesfully',
    type: 'BranchResponseDto',
  })
  @ApiResponse({ status: 404, description: 'Stamp not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findByClientId(@Param('id', new ParseIntPipe()) id: number) {
    try {
      const stampsData = await this.stampClientService.getStampsByClient(id);

      if (!stampsData?.length) {
        return {
          message: 'No stamps found for this client',
          stamps: [],
        };
      }

      const response = new StampClientResponseDto(stampsData);
      return {
        client_id: response.client_id,
        stamps: response.stamps,
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
