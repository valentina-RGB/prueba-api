import { IClient } from "src/modules/users/domain/models/client.interface";
import { IStamps } from "../models/stamps.interface";


export interface ICreateStampClientDto {
    client_id?: number;
    client?:IClient;
    stamp?: IStamps;
    stamp_id?: number;
    obtained_at?: Date;
    coffecoins_earned?: number;
    quantity?: number;
}