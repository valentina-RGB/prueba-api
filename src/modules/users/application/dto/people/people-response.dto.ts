export class PeopleResponseDto {
  id: number;
  user_id: number;
  user_email: string;
  type_document: string;
  number_document: string;
  full_name: string;
  phone_number: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(people: any) {
    this.id = people.id;
    this.user_id = people.user.id;
    this.user_email = people.user.email;
    this.type_document = people.type_document;
    this.number_document = people.number_document;
    this.full_name = people.full_name;
    this.phone_number = people.phone_number;
  }
}
