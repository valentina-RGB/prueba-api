import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Inject,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { IAlbum } from '../../domain/models/album.interface';
import {
  IAlbumService,
  IAlbumServiceToken,
} from '../../domain/album.service.interface';
import { CreateAlbumDto } from '../../application/dto/album/create-album.dto';
import { AlbumResponseDto } from '../../application/dto/album/get-response.dto';
import { ListAlbumsDto } from '../../application/dto/album/list-album-response.dto';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/auth/infrastructure/decorators/current-user.decorator';

@Controller('albums')
export class AlbumController {
  constructor(
    @Inject(IAlbumServiceToken)
    private readonly albumService: IAlbumService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<IAlbum> {
    try {
      return await this.albumService.createAlbum(createAlbumDto);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  @Public()
  @Get()
  async findAll() {
    try {
      const albums = await this.albumService.listAlbums();
      return new ListAlbumsDto(albums);
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.ADMIN_SYS)
  @Get('client')
  @ApiResponse({ status: 200, description: 'List of albums for the client' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAlbumsByClient(@CurrentUser() user) {
    try {
      const albums = await this.albumService.getAlbumsByClientId(user.id);

      return new ListAlbumsDto(albums);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const album = await this.albumService.getAlbum(id);
      return new AlbumResponseDto(album);
    } catch (error) {
      this.handleError(error);
      throw error;
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
