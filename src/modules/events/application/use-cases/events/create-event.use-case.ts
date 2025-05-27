import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { ICreateEvent } from 'src/modules/events/domain/dto/events.interface.dto';
import { IEvent } from 'src/modules/events/domain/models/events.interface';
import {
  IEventRepositoryToken,
  IEventRepository,
} from 'src/modules/events/domain/repositories/event.repository.interface';
import { CreateEventsBranchesUseCase } from '../events-branches/create-events-branches.use-case';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class CreateEventUseCase implements IUseCase<ICreateEvent, IEvent> {
  constructor(
    @Inject(IEventRepositoryToken)
    private readonly eventRepository: IEventRepository,
    private readonly createEventsBranches: CreateEventsBranchesUseCase,
    private readonly dataSource: DataSource,
  ) {}

  async execute(data: ICreateEvent): Promise<IEvent> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const eventRepository = this.eventRepository.withTransaction(
      queryRunner.manager,
    );

    try {
      if (data.start_date >= data.end_date)
        throw new BadRequestException('Start date must be before end date');

      const existingEvent = await eventRepository.findByName(data.name);
      if (existingEvent)
        throw new ConflictException('Event name already exists');

      const event = await eventRepository.create(data);

      await this.createEventsBranches.execute({
        eventId: event.id,
        branches: data.branch_ids ?? [],
        queryRunner,
      });

      await queryRunner.commitTransaction();
      return event;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }
}
