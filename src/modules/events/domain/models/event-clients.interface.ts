import { IClient } from "src/modules/users/domain/models/client.interface";
import { IEvent } from "./events.interface";

export interface IEventClient{
    id: number;
    event: IEvent;
    client: IClient;
}