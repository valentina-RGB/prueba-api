import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IRoleCreateDTO } from 'src/modules/users/domain/dto/role.dto.interface';

export class CreateRoleDto implements IRoleCreateDTO {
  @ApiProperty({ example: 'Admin', description: 'Name of the role' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
