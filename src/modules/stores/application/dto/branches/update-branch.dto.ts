import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IBranchesUpdateDto } from 'src/modules/stores/domain/dto/branch.interface.dto';

export class UpdateBranchDto implements IBranchesUpdateDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'The name must have at least 3 characters.' })
  @MaxLength(50, { message: 'The name must not exceed 50 characters.' })
  name?: string;

  @IsOptional()
  @MaxLength(15, { message: 'The phone number must not exceed 15 characters.' })
  @Matches(/^\d+$/, { message: 'The phone number must only contain digits.' })
  phone_number?: string;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'The address must not exceed 255 characters.' })
  address?: string;
}
