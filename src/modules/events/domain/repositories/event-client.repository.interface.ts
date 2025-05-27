import { IEventClient } from "../models/event-clients.interface";

export interface IEventClientRepository {
    getEventClientById(id: number): Promise<IEventClient[]>;
    addClientoToEvent(data: any): Promise<IEventClient>;
    findByEventAndClient(eventId: number, clientId: number): Promise<IEventClient | null>;
}

export const IEventClientRepositoryToken = Symbol('IEventClientRepository');