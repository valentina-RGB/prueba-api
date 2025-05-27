import {
  Controller,
  Post,
  Get,
  Body,
  Inject,
  HttpException,
  HttpStatus,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';

import {
  IAlbumService,
  IAlbumServiceToken,
} from '../../domain/album.service.interface';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreatePageStampsDto } from '../../application/dto/page-stamp/create-page-stamp.dto';
import { GetPageStampsResponseDto } from '../../application/dto/page-stamp/response-page-stamps.dto';
import { CreatePageStampsResponseDto } from '../../application/dto/page-stamp/reponse-create.dto';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';

@ApiTags('Pages-Stamps')
@Controller('pages-stamps')
export class PageStampsController {
  constructor(
    @Inject(IAlbumServiceToken)
    private readonly albumService: IAlbumService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register stamp on a page' })
  @ApiResponse({
    status: 201,
    description: 'A new stamp was registered on the page',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreatePageStampsDto })
  async createPageStamps(@Body() dto: CreatePageStampsDto) {
    const result = await this.albumService.addStampsToPage(dto);

    return new CreatePageStampsResponseDto(result);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS, Role.CLIENT, Role.ADMIN_STORE)
  @Get(':pageId')
  @ApiOperation({ summary: 'Get stamps by page ID' })
  @ApiResponse({ status: 200, description: 'Found stamps for the page' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async getStampsByPageId(@Param('pageId') pageId: number) {
    try {
      const pageStamps = await this.albumService.getStampsByPage(pageId);
      return new GetPageStampsResponseDto(pageStamps);
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
