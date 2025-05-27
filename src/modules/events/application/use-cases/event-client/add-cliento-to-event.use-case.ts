import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IEventClient } from 'src/modules/events/domain/models/event-clients.interface';
import {
  IEventClientRepository,
  IEventClientRepositoryToken,
} from 'src/modules/events/domain/repositories/event-client.repository.interface';
import { GetEventByIdUseCase } from '../events/get-event-by-id.use-case';
import { GetClientByUserUseCase } from 'src/modules/users/application/use-cases/clients/get-client-by-user.use-case';

@Injectable()
export class AddClientToEventUseCase implements IUseCase<{}, IEventClient> {
  constructor(
    @Inject(IEventClientRepositoryToken)
    private readonly eventClientRepository: IEventClientRepository,
    private readonly getEventByIdUseCase: GetEventByIdUseCase,
    private readonly getClientByUserId: GetClientByUserUseCase,
  ) {}

  async execute({ user, data }): Promise<IEventClient> {
    const client = await this.getClientByUserId.execute(user.id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const event = await this.getEventByIdUseCase.execute({id: data.event_id});
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (event.status !== 'PUBLISHED') {
      throw new BadRequestException('Event is not active');
    }

    const currentDate = new Date();
    const eventEndDate = new Date(event.end_date);

    if (currentDate > eventEndDate) {
      throw new BadRequestException('Cannot register for an event that has already ended');
    }

    const existingRegistration = await this.eventClientRepository.findByEventAndClient(
      event.id,
      client.id
    );

    if (existingRegistration) {
      throw new BadRequestException('Client is already registered for this event');
    }

    const newClientToEvent = {
      event: event,
      client: client
    };

    const clientToEvent = await this.eventClientRepository.addClientoToEvent(newClientToEvent);
    return clientToEvent;
  }
}
