import { IPeople } from "./people.interface";

export interface IClient {
  id: number;
  person: IPeople;
  coffee_coins: number;
  is_verified: boolean;
}
