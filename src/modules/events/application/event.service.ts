import { Injectable } from '@nestjs/common';
import { IEventService } from '../domain/event.service.interface';
import { IEvent } from '../domain/models/events.interface';
import { CreateEventUseCase } from './use-cases/events/create-event.use-case';
import { ICreateEvent } from '../domain/dto/events.interface.dto';
import { IEventClient } from '../domain/models/event-clients.interface';
import { GetEventByClientIdUseCase } from './use-cases/event-client/get-event-by-client.use-case';
import { ListEventUseCase } from './use-cases/events/list-event.use-case';
import { CreateEventClientDto } from './dto/event-client/create-event-client.dto';
import { AddClientToEventUseCase } from './use-cases/event-client/add-cliento-to-event.use-case';
import { GetEventsByStatusUseCase } from './use-cases/events/get-events-by-status.use-case';

@Injectable()
export class EventService implements IEventService {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly listEventUseCase: ListEventUseCase,
    private readonly getEventsByStatusUseCase: GetEventsByStatusUseCase,

    private readonly getEventByClientIdUseCase: GetEventByClientIdUseCase,
    private readonly addClientToEventUseCase: AddClientToEventUseCase,
  ) {}

  createEvent(event: ICreateEvent): Promise<IEvent> {
    return this.createEventUseCase.execute(event);
  }

  getEventById(id: number): Promise<IEvent | null> {
    throw new Error('Method not implemented.');
  }

  findAllEvents(): Promise<IEvent[]> {
    return this.listEventUseCase.execute();
  }

  findEventByStatus(status: string): Promise<IEvent[]> {
   return this.getEventsByStatusUseCase.execute(status);
  }

  // ------------------------------------------------

  getEventByClientId(id: number): Promise<IEventClient[]> {
    return this.getEventByClientIdUseCase.execute(id);
  }

  addClientToEvent(user: any, data: CreateEventClientDto){
      return this.addClientToEventUseCase.execute({user, data});
  }
}
