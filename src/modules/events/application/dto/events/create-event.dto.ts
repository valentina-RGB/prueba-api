import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  IsDateString,
  IsBoolean,
  IsNumber,
  Min,
  MaxLength,
  IsOptional,
  IsArray,
  IsInt,
} from 'class-validator';
import { ICreateEvent } from 'src/modules/events/domain/dto/events.interface.dto';

export class CreateEventDto implements ICreateEvent {
  @ApiProperty({
    example: 'Festival de Café Medellín',
    description: 'Title of the event',
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Un evento con las mejores tiendas de café en Medellín.',
    description: 'Detailed description of the event',
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({
    example: '2025-08-01T10:00:00Z',
    description: 'Start date and time of the event in ISO format',
  })
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    example: '2025-08-07T18:00:00Z',
    description: 'End date and time of the event in ISO format',
  })
  @IsDateString()
  end_date: Date;

  @ApiProperty({
    example: 'Medellín',
    description: 'General location of the event',
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  location: string;

  @ApiProperty({
    example: true,
    description: 'Whether the event is free or not',
  })
  @IsBoolean()
  is_free: boolean;

  @ApiProperty({
    example: 0,
    description: 'Price of the event. 0 means free.',
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  value?: number;

  @ApiProperty({
    example: 'Jhon Doe',
    description: 'Organizer of the event',
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  organizer: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'IDs of branches participating',
  })
  @IsArray()
  @IsInt({ each: true })
  branch_ids: number[];
}
