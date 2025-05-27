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
import { CreatePageDto } from '../../application/dto/page/create-page.dto';
import { ListPagesDto } from '../../application/dto/page/list-pages.dto';
import { CreatePageResponseDto } from '../../application/dto/page/create-response.dto';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';

@ApiTags('Pages')
@Controller('pages')
export class PageController {
  constructor(
    @Inject(IAlbumServiceToken)
    private readonly albumService: IAlbumService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new page' })
  @ApiResponse({ status: 201, description: 'Page created succesfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreatePageDto })
  async create(@Body() page: CreatePageDto) {
    const newPage = await this.albumService.createPage(page);
    return new CreatePageResponseDto(newPage);
  }

  @Public()
  @Get('album/:albumId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all pages' })
  @ApiResponse({ status: 200, description: 'Pages fetched succesfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(@Param('albumId') albumId: number) {
    try {
      const pages = await this.albumService.listPages(albumId);
      return new ListPagesDto(pages);
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
