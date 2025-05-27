import { IClient } from "src/modules/users/domain/models/client.interface";
import { IEvent } from "../models/events.interface";

export interface IcreateEventClientDto{
    event_id: number;
    event?:IEvent;
    client?:IClient;
    client_id?: number
} 