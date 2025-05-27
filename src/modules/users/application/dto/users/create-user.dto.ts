import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  ValidateIf,
  IsOptional,
} from 'class-validator';
import { IUserCreateDto } from 'src/modules/users/domain/dto/user.dto.interface';
import { IRole } from 'src/modules/users/domain/models/role.interface';

export class CreateUserDto implements IUserCreateDto {
  @ApiProperty({ example: 'jhon@doe.com', description: 'Email of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '1234567890abcdef',
    description: 'Google ID',
    required: false,
  })
  @ValidateIf((o) => !o.password)
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  id_google?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the user (min 6 characters)',
    required: false,
  })
  @ValidateIf((o) => !o.id_google)
  @IsNotEmpty()
  @MinLength(4)
  password?: string;

  @ApiProperty({ example: 1, description: 'Role of the user' })
  @IsOptional()
  role?: IRole;

  @IsOptional()
  status?: boolean;
}
