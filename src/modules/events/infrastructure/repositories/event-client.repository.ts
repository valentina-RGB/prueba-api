import { Injectable } from '@nestjs/common';
import { IEventClientRepository } from '../../domain/repositories/event-client.repository.interface';
import { IEventClient } from '../../domain/models/event-clients.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { EventClientEntity } from '../entities/event-client.entity';
import { Repository } from 'typeorm';
import { IcreateEventClientDto } from '../../domain/dto/events-clients.interface.dto';

@Injectable()
export class EventClientRepository implements IEventClientRepository {
  constructor(
    @InjectRepository(EventClientEntity)
    private readonly eventClientEntityRepository: Repository<EventClientEntity>,
  ) {}

  async getEventClientById(clientId: number): Promise<IEventClient[]> {
    const eventClients = await this.eventClientEntityRepository.find({
      where: {
        client: { id: clientId },
      },
      relations: {
        event: true,
      },
      order: {
        event: {
          id: 'DESC',
        },
      },
    });

    return eventClients;
  }

 async addClientoToEvent(data: IcreateEventClientDto): Promise<IEventClient> {
  try {
    const newEventClient = this.eventClientEntityRepository.create(data);
    return await this.eventClientEntityRepository.save(newEventClient);
  } catch (error) {
    console.error('Error adding client to event:', error);
    throw new Error(`Failed to add client to event: ${error.message}`);
  }
}

  async findByEventAndClient(eventId: number, clientId: number): Promise<IEventClient | null> {
  try {
    const eventClient = await this.eventClientEntityRepository.findOne({
      where: {
        event: { id: eventId },
        client: { id: clientId }
      },
      relations: ['event']
    });
    
    return eventClient;
  } catch (error) {
    console.error('Error finding event client:', error);
    return null;
  }
}
}
