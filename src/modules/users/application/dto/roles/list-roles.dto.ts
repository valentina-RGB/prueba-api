import { ApiProperty } from "@nestjs/swagger";
import { RoleResponseDto } from "./role-response.dto";

export class ListRolesDto {
  @ApiProperty({ type: [RoleResponseDto], description: 'List of roles' })
  roles: RoleResponseDto[];

  constructor(roles: any[]) {
    this.roles = roles.map((role) => new RoleResponseDto(role));
  }
}