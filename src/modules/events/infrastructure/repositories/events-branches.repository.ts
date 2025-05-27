import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { EventBranchEntity } from '../entities/event-branches.entity';
import { IEventBranches } from '../../domain/models/event-branches.interface';
import { IEventBranchesRepository } from '../../domain/repositories/events-branches.repository.dto';

export class EventsBranchesRepository implements IEventBranchesRepository {
  constructor(
    @InjectRepository(EventBranchEntity)
    private readonly eventBranchRepository: Repository<EventBranchEntity>,
  ) {}

  async create(data: any): Promise<IEventBranches> {
    return await this.eventBranchRepository.save(data);
  }

  async findByEventId(eventId: number): Promise<IEventBranches[]> {
    return await this.eventBranchRepository.find({
      where: { event: { id: eventId }},
      relations: ['event', 'branch'],
    });
  }

  withTransaction(manager: EntityManager): IEventBranchesRepository {
    return new EventsBranchesRepository(
      manager.getRepository(EventBranchEntity),
    );
  }
}
