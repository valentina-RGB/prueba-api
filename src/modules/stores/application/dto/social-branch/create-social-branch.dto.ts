import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ISocialBranchCreateDto } from 'src/modules/stores/domain/dto/social-branch.interface.dto';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { ISocialNetwork } from 'src/modules/stores/domain/models/social-network.interface';

export class CreateSocialBranchObjetsDto implements ISocialBranchCreateDto {
  @ApiProperty({ example: 1, description: 'Branch objet' })
  @IsOptional()
  branch: IBranches;

  @ApiProperty({ example: 1, description: 'social network' })
  @IsOptional()
  social_network: ISocialNetwork;

  @ApiProperty({
    example: 'Branch Facebook Page',
    description: 'Description of the social branch',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'The description must have at least 3 characters.' })
  @MaxLength(100, {
    message: 'The description must not exceed 100 characters.',
  })
  description: string;

  @ApiProperty({
    example: 'https://facebook.com/branch_page',
    description: 'URL of the social branch',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'The URL must have at least 5 characters.' })
  @MaxLength(255, { message: 'The URL must not exceed 255 characters.' })
  value: string;

  @ApiProperty({
    example: 1,
    description:
      'ID of the social network (1 for Facebook, 2 for Instagram, etc.)',
  })
  @IsNotEmpty()
  @IsNumber()
  social_network_id?: number;
}
