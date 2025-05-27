import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ICreateReviewDto } from 'src/modules/stores/domain/dto/review.interface.dto';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { IClient } from 'src/modules/users/domain/models/client.interface';

export class CreateReviewDto implements ICreateReviewDto {
  branch?: IBranches;
  client?: IClient;

  @IsNumber()
  @IsNotEmpty()
  branchId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsArray()
  @IsOptional()
  imageUrls?: string[] | undefined;
}
