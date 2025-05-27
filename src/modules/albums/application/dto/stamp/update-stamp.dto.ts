import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IUpdateStampDto } from 'src/modules/albums/domain/dto/stamp.dto.interface';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';

export class UpdateStampDto implements IUpdateStampDto {
  @IsNotEmpty({ message: 'Branch ID is required' })
  @IsNumber({}, { message: 'Branch ID value must be a number' })
  branch_id?: number;

  @IsOptional()
  branch?: IBranches;

  @IsOptional()
  @IsString({ message: 'Logo must be a string' })
  logo?: string;

  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  coffeecoins_value?: number;

  @IsOptional()
  status?: boolean;
}
