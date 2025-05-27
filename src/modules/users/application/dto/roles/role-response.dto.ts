export class RoleResponseDto {
  id: string;
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(role: any) {
    this.id = role.id;
    this.name = role.name;
    this.status = role.status;
  }
}
