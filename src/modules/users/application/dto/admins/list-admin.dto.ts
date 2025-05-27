import { ApiProperty } from '@nestjs/swagger';
import { AdminResponseDto } from './admin-reponse.dto';

export class ListAdminsDto {
  @ApiProperty({
    type: [AdminResponseDto],
    description: 'List of administrators',
  })
  admins: AdminResponseDto[];

  constructor(admins: any[]) {
    this.admins = admins.map((admin) => new AdminResponseDto(admin));
  }
}
