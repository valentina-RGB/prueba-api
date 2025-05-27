import { IPeople } from "../models/people.interface";

export interface IClientCreateDto {
  person: IPeople;
}

export interface IClientUpdateDto {
  person?: IPeople;
  quantity?: number;
  is_verified?: boolean;
}