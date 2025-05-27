import { IEvent } from './models/events.interface';
import { ICreateEvent } from './dto/events.interface.dto';
import { IEventClient } from './models/event-clients.interface';
import { IcreateEventClientDto } from './dto/events-clients.interface.dto';

export interface IEventService {
  createEvent(event: ICreateEvent): Promise<IEvent>;
  getEventById(id: number): Promise<IEvent | null>;
  findAllEvents(): Promise<IEvent[]>;
  findEventByStatus(
    status: string,
  ): Promise<IEvent[]>;

  
  getEventByClientId(clientId: number): Promise<IEventClient[]>;
  addClientToEvent(
    user: any,
    data: IcreateEventClientDto,
  ): Promise<IEventClient>;
}

export const IEventServiceToken = Symbol('IEventService');
