import { Inject, Injectable } from "@nestjs/common";
import { IUseCase } from "src/core/domain/interfaces/use-cases/use-case.interface";
import { IEvent } from "src/modules/events/domain/models/events.interface";
import { IEventRepositoryToken, IEventRepository } from "src/modules/events/domain/repositories/event.repository.interface";

@Injectable()
export class ListEventUseCase implements IUseCase<void, IEvent[]> {
    constructor(
         @Inject(IEventRepositoryToken)
         private readonly eventRepository: IEventRepository,
    ) {}

    async execute(): Promise<any> {
        return await this.eventRepository.findAll();
        
    }
}