import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class RegisterVisitDto {
  @ApiProperty({
    type: Number,
    description: 'Branch ID',
    example: 1,
  })
  branch_id: number;

  @ApiProperty({
    type: Number,
    description: 'Longitude of the user',
    example: -74.006,
  })
  latitude: number;

  @ApiProperty({
    type: Number,
    description: 'Latitude of the user',
    example: 40.7128,
  })
  longitude: number;


  @IsOptional()
  user: any;
}
