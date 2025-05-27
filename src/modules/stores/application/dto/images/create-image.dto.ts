import {
  IsString,
  IsNotEmpty,
  IsUrl,
  ValidateNested,
  IsInt,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ICreateImage,
  ICreateMultipleImages,
} from 'src/modules/stores/domain/dto/images.interface.dto';

class ImageItemDto {
  @IsString()
  @IsNotEmpty()
  image_type: string;

  @IsUrl()
  @IsNotEmpty()
  image_url: string;
}

export class CreateMultipleImagesDto implements ICreateMultipleImages {
  @IsString()
  @IsNotEmpty()
  related_type: string;

  @IsInt()
  @IsNotEmpty()
  related_id: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ImageItemDto)
  images: ImageItemDto[];
}
