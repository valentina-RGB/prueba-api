import { ApiProperty } from "@nestjs/swagger";
import { PeopleResponseDto } from "./people-response.dto";

export class ListPeopleDto {
  @ApiProperty({ type: [PeopleResponseDto], description: 'List of people' })
  people: PeopleResponseDto[];

  constructor(people: any[]) {
    this.people = people.map((person) => new PeopleResponseDto(person));
  }
}