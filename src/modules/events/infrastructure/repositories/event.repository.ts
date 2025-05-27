import { Injectable } from '@nestjs/common';
import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  ICreateEvent,
  IUpdateEvent,
} from '../../domain/dto/events.interface.dto';
import { IEvent } from '../../domain/models/events.interface';
import { EventEntity } from '../entities/events.entity';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventEntityRepository: Repository<EventEntity>,
  ) {}

  async findAll(): Promise<IEvent[]> {
    return await this.eventEntityRepository.find();
  }

  async findById(id: number): Promise<IEvent | null> {
    return await this.eventEntityRepository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<IEvent | null> {
    return await this.eventEntityRepository.findOne({ where: { name } });
  }

  async findEventByStatus(
    status: 'PUBLISHED' | 'RUNNING' | 'FINISHED' | 'CANCELLED',
  ): Promise<IEvent[]> {
    return await this.eventEntityRepository.find({
      where: { status },
      order: { id: 'ASC' },
    });
  }

  async create(eventData: ICreateEvent): Promise<IEvent> {
    const event = await this.eventEntityRepository.create(eventData)
    return await this.eventEntityRepository.save(event);
  }

  async update(id: number, data: IUpdateEvent): Promise<IEvent> {
    await this.eventEntityRepository.update(id, data);

    const event = await this.findById(id);
    if (!event) throw new Error('Event not found');

    return event;
  }

  async delete(id: number): Promise<void> {
    const result = await this.eventEntityRepository.delete(id);
  }

  withTransaction(manager: EntityManager): IEventRepository {
    return new EventRepository(manager.getRepository(EventEntity));
  }
}
