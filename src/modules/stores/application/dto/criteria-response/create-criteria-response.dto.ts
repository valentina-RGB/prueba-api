import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ICreateCriteriaResponseDto } from 'src/modules/stores/domain/dto/criteria.interface.dto';

export class CreateCriteriaResponseDto implements ICreateCriteriaResponseDto{
  @ApiProperty({
    example: 1,
    description: 'ID of the criteria being responded to',
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'The criteriaId must be a number.' })
  criteriaId: number;

  @ApiProperty({
    example: 'This is a sample response.',
    description: 'Response text for the criteria',
  })
  @IsNotEmpty()
  @IsString()
  response_text: string;
  
  image_url?: string;
}
