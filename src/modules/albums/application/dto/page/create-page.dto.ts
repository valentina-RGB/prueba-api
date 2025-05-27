import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ICreatePageDto } from 'src/modules/albums/domain/dto/page.dto.interface';
import { IAlbum } from 'src/modules/albums/domain/models/album.interface';

export class CreatePageDto implements ICreatePageDto {
  
  @IsOptional()
  album?: IAlbum;

  @ApiProperty({ example: 1, description: 'ID of the album this page belongs to' })
  @IsNotEmpty()
  @IsNumber()
  album_id: number;

  // @ApiProperty({ example: 'BRANCHES', description: 'Type of the page' })
  // @IsNotEmpty()
  // @IsString()
  // type: string;

  @ApiProperty({ example: 'Página 1', description: 'Title of the page' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Descripción de la página', description: 'Description of the page' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: true, description: 'Status of the page', required: false })
  @IsOptional()
  status?: boolean;
}
