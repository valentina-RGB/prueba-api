import { Inject, Injectable } from "@nestjs/common";
import { IUseCase } from "src/core/domain/interfaces/use-cases/use-case.interface";
import { IEventBranches } from "src/modules/events/domain/models/event-branches.interface";
import { IEventBranchesRepositoryToken, IEventBranchesRepository } from "src/modules/events/domain/repositories/events-branches.repository.dto";

@Injectable()
export class GetEventBranchesByEventUseCase implements IUseCase<number, IEventBranches[]> {
  constructor(
    @Inject(IEventBranchesRepositoryToken)
    private readonly eventBranchesRepository: IEventBranchesRepository,
  ) {}

  async execute(eventId: number): Promise<IEventBranches[]> {
    const eventBranches = await this.eventBranchesRepository.findByEventId(eventId);
    return eventBranches;
  }
}