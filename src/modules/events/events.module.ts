import { forwardRef, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IEventServiceToken } from './domain/event.service.interface';
import { EventService } from './application/event.service';
import { EventBranchEntity } from './infrastructure/entities/event-branches.entity';
import { EventEntity } from './infrastructure/entities/events.entity';
import { IEventRepositoryToken } from './domain/repositories/event.repository.interface';
import { EventRepository } from './infrastructure/repositories/event.repository';
import { CreateEventUseCase } from './application/use-cases/events/create-event.use-case';
import { EventController } from './infrastructure/controllers/event.controller';
import { EventClientEntity } from './infrastructure/entities/event-client.entity';
import { EventClientController } from './infrastructure/controllers/event-client.controller';
import { IEventClientRepositoryToken } from './domain/repositories/event-client.repository.interface';
import { EventClientRepository } from './infrastructure/repositories/event-client.repository';
import { GetEventByClientIdUseCase } from './application/use-cases/event-client/get-event-by-client.use-case';
import { UsersModule } from '../users/users.module';
import { GetEventByIdUseCase } from './application/use-cases/events/get-event-by-id.use-case';
import { ListEventUseCase } from './application/use-cases/events/list-event.use-case';
import { AddClientToEventUseCase } from './application/use-cases/event-client/add-cliento-to-event.use-case';
import { GetEventsByStatusUseCase } from './application/use-cases/events/get-events-by-status.use-case';
import { EventsBranchesRepository } from './infrastructure/repositories/events-branches.repository';
import { IEventBranchesRepositoryToken } from './domain/repositories/events-branches.repository.dto';
import { CreateEventsBranchesUseCase } from './application/use-cases/events-branches/create-events-branches.use-case';
import { StoreModule } from '../stores/stores.module';
import { GetEventBranchesByEventUseCase } from './application/use-cases/events-branches/get-event-branches-by-event.use-case';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => StoreModule),
    forwardRef(() => MailerModule),
    TypeOrmModule.forFeature([
      EventEntity,
      EventBranchEntity,
      EventClientEntity,
    ]),
    RouterModule.register([
      {
        path: 'api/v2',
        module: EventModule,
      },
    ]),
  ],
  controllers: [EventController, EventClientController],

  providers: [
    { provide: IEventServiceToken, useClass: EventService },

    { provide: IEventRepositoryToken, useClass: EventRepository },
    { provide: IEventClientRepositoryToken, useClass: EventClientRepository },
    {
      provide: IEventBranchesRepositoryToken,
      useClass: EventsBranchesRepository,
    },

    CreateEventUseCase,
    GetEventByIdUseCase,
    ListEventUseCase,
    GetEventsByStatusUseCase,

    GetEventByClientIdUseCase,
    AddClientToEventUseCase,

    CreateEventsBranchesUseCase,
    GetEventBranchesByEventUseCase,
  ],
  exports: [GetEventByIdUseCase, GetEventBranchesByEventUseCase],
})
export class EventModule {}
