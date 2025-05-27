import { IClient } from "src/modules/users/domain/models/client.interface";
import { IBranches } from "../models/branches.interface";

export interface IRecommendationCreateDto {
    client?: IClient,
    client_id?: number,
    branch?: IBranches
    branch_id?: number,
    message: string,
}