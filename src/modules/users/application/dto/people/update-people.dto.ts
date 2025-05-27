import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsEmail,
} from 'class-validator';
import { IPersonUpdateDto } from 'src/modules/users/domain/dto/person.dto.interface';

export class UpdatePersonDto implements IPersonUpdateDto {
  @ApiProperty({ example: 'CC', description: 'Type document', required: false })
  @IsOptional()
  @IsString({ message: 'The type document must be a string.' })
  type_document?: string;

  @ApiProperty({
    example: '123456',
    description: 'Document number',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'The document number must be a string.' })
  @MinLength(6, {
    message: 'The document number must have at least 6 characters.',
  })
  @MaxLength(12, {
    message: 'The document number must not exceed 12 characters.',
  })
  @Matches(/^\d+$/, {
    message: 'The document number must only contain digits.',
  })
  number_document?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'The full name must be a string.' })
  @MinLength(3, { message: 'The full name must have at least 3 characters.' })
  @MaxLength(50, { message: 'The full name must not exceed 50 characters.' })
  full_name?: string;

  @ApiProperty({
    example: '3001234567',
    description: 'Phone number',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'The phone number must be a string.' })
  @MaxLength(15, { message: 'The phone number must not exceed 15 characters.' })
  @Matches(/^\d+$/, { message: 'The phone number must only contain digits.' })
  phone_number?: string;

  @ApiProperty({ example: 'jhon@doe.com', description: 'Email of the user' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the user (min 4  characters)',
    required: false,
  })
  @IsOptional()
  @MinLength(4)
  password?: string;
}
