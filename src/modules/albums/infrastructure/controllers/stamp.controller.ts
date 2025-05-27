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
import {
  IAlbumService,
  IAlbumServiceToken,
} from '../../domain/album.service.interface';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateStampDto } from '../../application/dto/stamp/create-stamp.dto';
import { StampResponseDto } from '../../application/dto/stamp/stamp-response.dto';
import { ListStampsDto } from '../../application/dto/stamp/list-stamp.dto';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';

@ApiTags('Stamps')
@Controller('stamps')
export class StampController {
  constructor(
    @Inject(IAlbumServiceToken)
    private readonly albumService: IAlbumService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiResponse({ status: 201, description: 'Branch created succesfully' })
  @ApiResponse({ status: 409, description: 'Stamp is already' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateStampDto })
  async create(@Body() stampData: CreateStampDto) {
    try {
      const stamp = await this.albumService.createStamp(stampData);
      return {
        message: 'Stamp created succesfully',
        stamp: new StampResponseDto(stamp),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS, Role.CLIENT)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all stamps' })
  @ApiResponse({ status: 200, description: 'Stamps fetched succesfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    try {
      const stamps = await this.albumService.listStamps();
      return {
        message: 'Stamps fetched succesfully',
        stamps: new ListStampsDto(stamps).stamps,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS, Role.CLIENT)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a stamp by id' })
  @ApiResponse({ status: 200, description: 'Stamp fetched succesfully' })
  @ApiResponse({ status: 404, description: 'Stamp not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    try {
      const stamp = await this.albumService.getStamp(id);
      return {
        message: 'Stamp fetched succesfully',
        stamp: new StampResponseDto(stamp),
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
