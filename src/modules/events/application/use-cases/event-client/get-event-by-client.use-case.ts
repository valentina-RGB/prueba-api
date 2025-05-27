import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IUseCase } from "src/core/domain/interfaces/use-cases/use-case.interface";
import { IEventClient } from "src/modules/events/domain/models/event-clients.interface";
import { IEventClientRepository, IEventClientRepositoryToken } from "src/modules/events/domain/repositories/event-client.repository.interface";
import { GetClientByUserUseCase } from "src/modules/users/application/use-cases/clients/get-client-by-user.use-case";
import { GetEventByIdUseCase } from "../events/get-event-by-id.use-case";

@Injectable()
export class GetEventByClientIdUseCase implements IUseCase<number, IEventClient[]> {
    constructor(
        @Inject(IEventClientRepositoryToken)
        private readonly eventClientRepository: IEventClientRepository,
        private readonly getClientByUserIdUseCase: GetClientByUserUseCase,
    ) {}

    async execute(id:number): Promise<IEventClient[]> {
        const client = await this.getClientByUserIdUseCase.execute(id);
        if (!client) {
            throw new NotFoundException('Client not found');
        }

        const eventClient= await this.eventClientRepository.getEventClientById(client.id);

        return eventClient;

    }
}