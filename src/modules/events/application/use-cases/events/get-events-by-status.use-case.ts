import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { IEvent } from "src/modules/events/domain/models/events.interface";
import { IEventRepositoryToken, IEventRepository } from "src/modules/events/domain/repositories/event.repository.interface";


@Injectable()
export class GetEventsByStatusUseCase {
  constructor(
    @Inject(IEventRepositoryToken)
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(status: string): Promise<IEvent[]> {
    try {
      if (!status) {
        throw new BadRequestException("Status is required");
      }
      const allowedStatuses = ['PUBLISHED', 'RUNNING', 'FINISHED', 'CANCELLED'];
      if (!allowedStatuses.includes(status)) {
        throw new BadRequestException("Invalid status");
      }
      const events = await this.eventRepository.findEventByStatus(status);
      return events;
    } catch (error) {
      throw new BadRequestException(
        `Error fetching events with status ${status}: ${error.message}`,)
    }
  }
}