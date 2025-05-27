import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IEvent } from 'src/modules/events/domain/models/events.interface';
import {
  IEventRepositoryToken,
  IEventRepository,
} from 'src/modules/events/domain/repositories/event.repository.interface';
import { QueryRunner } from 'typeorm';

@Injectable()
export class GetEventByIdUseCase
  implements IUseCase<{ id: number; queryRunner?: QueryRunner }, IEvent | null>
{
  constructor(
    @Inject(IEventRepositoryToken)
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute({
    id,
    queryRunner,
  }: {
    id: number;
    queryRunner?: QueryRunner;
  }): Promise<IEvent | null> {
    const eventRepository = queryRunner
      ? this.eventRepository.withTransaction(queryRunner.manager)
      : this.eventRepository;

    const event = await eventRepository.findById(id);
    if (!event) throw new NotFoundException('Event not found');

    return event;
  }
}
