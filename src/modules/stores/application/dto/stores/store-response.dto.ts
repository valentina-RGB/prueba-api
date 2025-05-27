export class StoreRenponseDto {
  id: number;
  name: string;
  type_document: string;
  number_document: string;
  logo: string;
  email: string;
  phone_number: string;
  status: boolean;

  constructor(store: any) {
    this.id = store.id;
    this.name = store.name;
    this.type_document = store.type_document;
    this.number_document = store.number_document;
    this.logo = store.logo;
    this.email = store.email;
    this.phone_number = store.phone_number;
    this.status = store.status;
  }
}
