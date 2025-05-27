import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IUploadImageDTO } from '../../domain/dto/imagen.interface.dto';


export class UploadImageDto implements IUploadImageDTO{
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The image file to be uploaded',
  })
  @IsNotEmpty({ message: 'The file must not be empty.' })
  file: Express.Multer.File;

  @ApiProperty({
    example: 'product',
    description: 'Type of the image (e.g., "product", "variant")',
    required: false,
  })
  @IsString({ message: 'The type must be a string.' })
  type?: string;
}
