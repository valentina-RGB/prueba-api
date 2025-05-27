import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ICreateStampDto } from 'src/modules/albums/domain/dto/stamp.dto.interface';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';

export class CreateStampDto implements ICreateStampDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the album this page belongs to',
  })
  @IsNotEmpty({ message: 'Branch ID is required' })
  @IsNumber({}, { message: 'Branch ID value must be a number' })
  branch_id: number;

  @ApiProperty({})
  @IsOptional()
  branch?: IBranches;

  @IsOptional()
  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'Logo of the stamp',
  })
  @IsString({ message: 'Logo must be a string' })
  logo?: string;

  @ApiProperty({
    example: 'Stamp Name',
    description: 'Name of the stamp',
  })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Description of the stamp',
    description: 'Description of the stamp',
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 100,
    description: 'Coffeecoins value of the stamp',
  })
  @IsNumber()
  @IsOptional()
  coffeecoins_value?: number;
}
