import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ISocialBranchForBranchDto } from 'src/modules/stores/domain/dto/social-branch.interface.dto';

export class CreateSocialBranchForBranchDto implements ISocialBranchForBranchDto {

  @ApiProperty({ example: 1, description: 'social network' })
  @IsOptional()
  social_network_id: number;

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

}
