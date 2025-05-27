import { EntityManager } from 'typeorm';
import { ICreateEvent } from '../dto/events.interface.dto';
import { IEvent } from '../models/events.interface';

export interface IEventRepository {
  create(event: ICreateEvent): Promise<IEvent>;
  findById(id: number): Promise<IEvent | null>;
  findByName(name: string): Promise<IEvent | null>;
  findEventByStatus(status: string): Promise<IEvent[]>;
  findAll(): Promise<IEvent[]>;
  update(id: number, event: Partial<IEvent>): Promise<IEvent | null>;
  delete(id: number): Promise<void>;
  withTransaction(manager: EntityManager): IEventRepository;
}

export const IEventRepositoryToken = Symbol('IEventRepository');
