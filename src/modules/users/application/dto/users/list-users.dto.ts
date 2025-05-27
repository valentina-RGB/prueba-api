import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class ListUsersDto {
  @ApiProperty({ type: [UserResponseDto], description: 'List of users' })
  users: UserResponseDto[];

  constructor(users: any[]) {
    this.users = users.map((user) => new UserResponseDto(user));
  }
}
