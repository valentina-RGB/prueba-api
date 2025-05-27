import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { IPersonCreateDto } from 'src/modules/users/domain/dto/person.dto.interface';
import { IUser } from 'src/modules/users/domain/models/user.interface';

export class CreatePeopleDto implements IPersonCreateDto {
  @ApiProperty({ example: 1, description: 'User of the person' })
  @IsOptional()
  user?: IUser;

  @ApiProperty({ example: 'CC', description: 'Type document' })
  @IsNotEmpty()
  @IsString()
  type_document: string;

  @ApiProperty({ example: '123456', description: 'Document number' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'The document number must have at least 6 characters.',
  })
  @MaxLength(12, {
    message: 'The document number must not exceed 12 characters.',
  })
  @Matches(/^\d+$/, {
    message: 'The document number must only contain digits.',
  })
  number_document: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'The full name must have at least 3 characters.' })
  @MaxLength(50, { message: 'The full name must not exceed 50 characters.' })
  full_name: string;

  @ApiProperty({ example: '3001234567', description: 'Phone number' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15, { message: 'The phone number must not exceed 15 characters.' })
  @Matches(/^\d+$/, { message: 'The phone number must only contain digits.' })
  phone_number: string;
}
