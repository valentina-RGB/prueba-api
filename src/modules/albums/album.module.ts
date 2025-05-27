import { forwardRef, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreModule } from '../stores/stores.module';
import { UsersModule } from '../users/users.module';

// Controllers
import { AlbumController } from './infrastructure/controllers/album.controller';
import { PageController } from './infrastructure/controllers/page.controller';
import { StampController } from './infrastructure/controllers/stamp.controller';
import { PageStampsController } from './infrastructure/controllers/page-stamps.controller';

// Entities
import { AlbumEntity } from './infrastructure/entities/Album.entity';
import { PageEntity } from './infrastructure/entities/page.entity';
import { StampsEntity } from './infrastructure/entities/stamps.entity';
import { PageStampsEntity } from './infrastructure/entities/page-stamps.entity';
import { StampClientEntity } from './infrastructure/entities/stamp-clients.entity';

// Repositories
import { AlbumRepository } from './infrastructure/repositories/album.repository';
import { PageRepository } from './infrastructure/repositories/page.repository';
import { StampRepository } from './infrastructure/repositories/stamp.repository';
import { PageStampsRepository } from './infrastructure/repositories/page-stamps.repository';

// Services
import { AlbumService } from './application/album.service';

// Tokens
import { IPageRepositoryToken } from './domain/repositories/page.repository.interface';
import { IAlbumServiceToken } from './domain/album.service.interface';
import { IAlbumRepositoryToken } from './domain/repositories/album.repository.interface';
import { IStampRepositoryToken } from './domain/repositories/stamp.repository.interface';
import { IPageStampsRepositoryToken } from './domain/repositories/page-stamp.repository.interface';

// Use Cases
import { CreateAlbumUseCase } from './application/use-cases/album/create-album.use-case';

import { ListAlbumUseCase } from './application/use-cases/album/list-album.use-case';
import { CreatePageUseCase } from './application/use-cases/page/create-page.use-case';
import { ListPageUseCase } from './application/use-cases/page/list-page.use-case';

import { GetStampUseCase } from './application/use-cases/stamp/get-stamp.use-case';

import { CreateStampUseCase } from './application/use-cases/stamp/create-stamp.use-case';
import { ListStampUseCase } from './application/use-cases/stamp/list-stamp.use-case';

import { CreatePageStampUseCase } from './application/use-cases/page-stamps/create-page-stamp.use-case';
import { GetStampsByPageIdUseCase } from './application/use-cases/page-stamps/get-stamps-by-page.use-case';
import { GetPageUseCase } from './application/use-cases/page/get-page.use-case';
import { GetAlbumUseCase } from './application/use-cases/album/get-album.use-case';
import { StampClientController } from './infrastructure/controllers/stamp-client.controller';
import { IStampClientsRepositoryToken } from './domain/repositories/stamp-clients.respository.interface';
import { StampClientsRepository } from './infrastructure/repositories/stamp-clients.repository';
import { GetStampByClientUseCase } from './application/use-cases/stamp-client/get-stamp-by-client.use-case';
import { AddStampToClientUseCase } from './application/use-cases/stamp-client/add-stamp-to-client.use-case';
import { GetStampByBranch } from './application/use-cases/stamp/get-stamp-by-branch-id.use-case';
import { GetAnnualAlbumByYearUseCase } from './application/use-cases/album/get-album-by-year.use-case';
import { UpdateStampUseCase } from './application/use-cases/stamp/update-stamp.use-case';
import { EventModule } from '../events/events.module';
import { CreatePageStampsToEventUseCase } from './application/use-cases/page-stamps/create-page-stamps-to-event.use-case';
import { ListAlbumsByClientUseCase } from './application/use-cases/album/list-albums-by-client.use-case';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => StoreModule),
    forwardRef(() => EventModule),
    TypeOrmModule.forFeature([
      AlbumEntity,
      PageEntity,
      StampsEntity,
      PageStampsEntity,
      StampClientEntity,
    ]),
    RouterModule.register([
      {
        path: 'api/v2',
        module: AlbumModule,
      },
    ]),
  ],
  controllers: [
    AlbumController,
    PageController,
    StampController,
    PageStampsController,
    StampClientController,
  ],

  providers: [
    { provide: IAlbumRepositoryToken, useClass: AlbumRepository },
    { provide: IPageRepositoryToken, useClass: PageRepository },
    { provide: IStampRepositoryToken, useClass: StampRepository },
    { provide: IPageStampsRepositoryToken, useClass: PageStampsRepository },
    { provide: IStampClientsRepositoryToken, useClass: StampClientsRepository },

    { provide: IAlbumServiceToken, useClass: AlbumService },

    CreateAlbumUseCase,
    GetAlbumUseCase,
    GetAnnualAlbumByYearUseCase,
    ListAlbumsByClientUseCase,
    ListAlbumUseCase,

    CreatePageUseCase,
    GetPageUseCase,
    ListPageUseCase,

    CreateStampUseCase,
    ListStampUseCase,
    GetStampUseCase,
    UpdateStampUseCase,

    GetStampByClientUseCase,
    AddStampToClientUseCase,
    GetStampByBranch,

    CreatePageStampUseCase,
    GetStampsByPageIdUseCase,
    CreatePageStampsToEventUseCase,

  ],
  exports: [
    IAlbumServiceToken,
    IStampRepositoryToken,
    CreateStampUseCase,
    AddStampToClientUseCase,
    GetStampByBranch,
    UpdateStampUseCase,
    GetStampByClientUseCase,
  ],
})
export class AlbumModule {}
