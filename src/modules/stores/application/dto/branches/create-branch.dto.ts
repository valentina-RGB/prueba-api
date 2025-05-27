import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateSocialBranchObjetsDto } from '../social-branch/create-social-branch.dto';
import { Type } from 'class-transformer';
import { IBranchesCreateDto } from 'src/modules/stores/domain/dto/branch.interface.dto';
import { CreateSocialBranchForBranchDto } from '../social-branch/social-branch-for-branch.dto';

export class CreateBranchDto implements IBranchesCreateDto {
  @ApiProperty({
    example: 1,
    description: 'Store ID associated with the branch',
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'The store_id must be a number.' })
  store_id: number;

  @ApiProperty({ example: 'Main Branch', description: 'Name of the branch' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'The name must have at least 3 characters.' })
  @MaxLength(50, { message: 'The name must not exceed 50 characters.' })
  name: string;

  @ApiProperty({ example: '3001234567', description: 'Branch phone number' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15, { message: 'The phone number must not exceed 15 characters.' })
  @Matches(/^\d+$/, { message: 'The phone number must only contain digits.' })
  phone_number: string;

  @ApiProperty({ example: 4.5, description: 'Average rating of the branch' })
  @IsOptional()
  @IsNumber({}, { message: 'The average_rating must be a number.' })
  average_rating: number;

  @IsString({ message: 'PENDING - APPROVED - REJECTED' })
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: 6.244203,
    description: 'Latitude of the branch location',
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'The latitude must be a number.' })
  latitude: number;

  @ApiProperty({
    example: -75.5812119,
    description: 'Longitude of the branch location',
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'The longitude must be a number.' })
  longitude: number;

  @ApiProperty({
    example: '123 Main St, Medellín, Colombia',
    description: 'Physical address of the branch',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255, { message: 'The address must not exceed 255 characters.' })
  address: string;

  @ApiProperty({
    type: [CreateSocialBranchObjetsDto],
    description: 'Array of social networks for this branch',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => CreateSocialBranchForBranchDto)
  social_branches: CreateSocialBranchForBranchDto[];
}
