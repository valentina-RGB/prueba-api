import { IRole } from "src/modules/users/domain/models/role.interface";

export class UserResponseDto {
  id: string;
  email: string;
  role: IRole;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role?.name;
    this.status = user.status;
  }
}
