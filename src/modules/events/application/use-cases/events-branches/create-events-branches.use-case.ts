import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IEventBranches } from 'src/modules/events/domain/models/event-branches.interface';
import {
  IEventBranchesRepository,
  IEventBranchesRepositoryToken,
} from 'src/modules/events/domain/repositories/events-branches.repository.dto';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';
import { GetEventByIdUseCase } from '../events/get-event-by-id.use-case';
import { DataSource, QueryRunner } from 'typeorm';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { SendBranchInscriptionToEventUseCase } from 'src/modules/mailer/application/use-cases/send-branch-inscription-to-event.use-case';

@Injectable()
export class CreateEventsBranchesUseCase
  implements
    IUseCase<
      { eventId: number; branches: number[]; queryRunner?: QueryRunner },
      IEventBranches[]
    >
{
  constructor(
    @Inject(IEventBranchesRepositoryToken)
    private readonly eventRepository: IEventBranchesRepository,
    private readonly findEventById: GetEventByIdUseCase,
    private readonly findBranchById: GetBranchUseCase,
    private readonly sendEmail: SendBranchInscriptionToEventUseCase,
  ) {}

  async execute({
    eventId,
    branches,
    queryRunner,
  }: {
    eventId: number;
    branches: number[];
    queryRunner?: QueryRunner;
  }): Promise<IEventBranches[]> {
    const eventRepository = queryRunner
      ? this.eventRepository.withTransaction(queryRunner.manager)
      : this.eventRepository;

    if (!branches.length)
      throw new BadRequestException('Branches array cannot be empty');

    const event = await this.findEventById.execute({
      id: eventId,
      queryRunner,
    });
    if (!event) throw new NotFoundException('Event not found');

    const eventBranches: IEventBranches[] = [];

    for (const branchId of branches) {
      const branch = await this.findBranchById.execute(branchId);
      if (!branch) throw new NotFoundException('Branch not found');

      const eventBranch = await eventRepository.create({
        event,
        branch,
      });

      eventBranches.push(eventBranch);
    }

    await this.sendEmailsToBranches(event, eventBranches);
    return eventBranches;
  }
  private async sendEmailsToBranches(
    event: any,
    branches: IEventBranches[],
  ): Promise<void> {
    branches.forEach((branch) => {
      this.sendEmail.execute({
        event,
        branch: branch.branch,
      });
    });
  }
}
