import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { ICreatePageStampsDto } from 'src/modules/albums/domain/dto/page-stamp.dto.interface';
import { IPageStamps } from 'src/modules/albums/domain/models/page-stamps.interface';
import { IPage } from 'src/modules/albums/domain/models/page.interface';
import { IStamps } from 'src/modules/albums/domain/models/stamps.interface';

export class CreatePageStampsDto implements ICreatePageStampsDto {
  @IsOptional()
  page?: IPage | undefined;

  @ApiProperty({ example: 1, description: 'ID of the page' })
  @IsNotEmpty()
  @IsNumber()
  pageId: number;

  @IsOptional()
  stamp?: IStamps | undefined;

  @ApiProperty({
    description: 'Array of Stamp IDs to add to the page',
    type: [String],
    example: [1, 2],
  })
  @IsArray()
  @ArrayNotEmpty()
  stampIds: number[];
}

export interface PartialPageStampCreationResult {
  created: IPageStamps[];
  errors: { stampId: number; reason: string }[];
}
