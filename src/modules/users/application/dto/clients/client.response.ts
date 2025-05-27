import { PeopleResponseDto } from '../people/people-response.dto';
export class ClientResponseDto {
  id: number;
  person: any;
  coffee_coins: number;
  is_verified: boolean;

  constructor(client: any) {
    this.id = client.id;
    this.person = new PeopleResponseDto(client.person);
    this.coffee_coins = client.coffee_coins;
    this.is_verified = client.is_verified;
    
  }
}
