import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsUrl,
  IsOptional,
  Matches,
} from 'class-validator';
import { IStoreCreateDto } from 'src/modules/stores/domain/dto/store.interface.dto';

export class CreateStoreDto implements IStoreCreateDto {
  @ApiProperty({
    example: 'My Store',
    description: 'Name of the store',
  })
  @IsString({ message: 'The name must be a string.' })
  @IsNotEmpty({ message: 'The name cannot be empty.' })
  @MinLength(3, { message: 'The name must have at least 3 characters.' })
  @MaxLength(50, { message: 'The name must not exceed 50 characters.' })
  name: string;

  @ApiProperty({
    example: 'NIT',
    description: 'The document type (e.g., NIT)',
  })
  @IsString({ message: 'The type_document must be a string.' })
  @IsNotEmpty({ message: 'The type_document cannot be empty.' })
  type_document: string;

  @ApiProperty({ example: '123456', description: 'Document number' })
  @IsNotEmpty({ message: 'The document number cannot be empty.' })
  @IsString({ message: 'The document number must be a string.' })
  @MinLength(6, {
    message: 'The document number must have at least 6 characters.',
  })
  @MaxLength(12, {
    message: 'The document number must not exceed 12 characters.',
  })
  @Matches(/^[\d-]+$/, {
    message: 'The document number must only contain digits and hyphens (-).',
  })
  number_document: string;

  @ApiProperty({ example: '3001234567', description: 'Phone number' })
  @IsNotEmpty({ message: 'The phone number cannot be empty.' })
  @IsString({ message: 'The phone number must be a string.' })
  @MaxLength(15, { message: 'The phone number must not exceed 15 characters.' })
  @Matches(/^\d+$/, { message: 'The phone number must only contain digits.' })
  phone_number: string;

  @ApiProperty({
    example: 'https://mystore.com/logo.png',
    description: "URL of the store's logo",
    required: false,
  })
  @IsUrl({}, { message: 'The logo must be a valid URL.' })
  @IsOptional()
  logo?: string;

  @ApiProperty({ example: 'jhon@doe.com', description: 'Email of the user' })
  @IsNotEmpty({ message: 'The email cannot be empty.' })
  @IsEmail({}, { message: 'The email must be a valid email address.' })
  email: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the store is active',
    required: false,
  })
  @IsString({ message: 'PENDING - APPROVED - REJECTED' })
  @IsOptional()
  status?: string;
}
