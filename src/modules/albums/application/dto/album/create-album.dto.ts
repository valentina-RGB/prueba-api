import { IsString, IsOptional, IsBoolean, IsDateString, Length, IsNumber } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  logo?: string;

  @IsString()
  introduction: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  type?: string 

  @IsOptional()
  @IsNumber()
  entity_id?: number;
  
  @IsDateString()
  start_date: Date;

  @IsDateString()
  end_date: Date;

  @IsOptional()
  @IsBoolean()
  status?: boolean = true; 
}
