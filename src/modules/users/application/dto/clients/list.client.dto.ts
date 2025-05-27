import { ApiProperty } from "@nestjs/swagger";
import { ClientResponseDto } from "./client.response";

export class ListClientsDto {
  @ApiProperty({ type: [ClientResponseDto], description: 'List of clients' })
  clients: ClientResponseDto[];

  constructor(clients: any[]) {
    this.clients = clients.map((client) => new ClientResponseDto(client));
  }
}