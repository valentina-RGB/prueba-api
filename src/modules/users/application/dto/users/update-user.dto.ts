import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IUserUpdateDto } from '../../../domain/dto/user.dto.interface';

export class UpdateUserDto implements IUserUpdateDto {
  @ApiProperty({ example: 'jhon@doe.com', description: 'Email of the user' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '1234567890abcdef',
    description: 'Google ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  id_google?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the user (min 6 characters)',
  })
  @ValidateIf((o) => o.password !== '')
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsNumber()
  role_id?: number;
}
