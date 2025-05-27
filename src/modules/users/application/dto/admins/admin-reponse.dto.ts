import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { IStore } from 'src/modules/stores/domain/models/store.interface';
import { PeopleResponseDto } from 'src/modules/users/application/dto/people/people-response.dto';

export class AdminResponseDto {
  id: number;
  admin_type: string;
  entity: IStore | IBranches | null;
  person: any;

  constructor(admin: any) {
    this.id = admin.id;
    this.admin_type = admin.admin_type;
    this.entity = admin.store?.name ?? admin.branch?.name ?? null;
    this.person = new PeopleResponseDto(admin.person);
  }
}
