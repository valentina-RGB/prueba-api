import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

class AttributeInput {
  @IsNumber()
  @ApiProperty({ example: 1 })
  attributeId: number;

  @IsString()
  @ApiProperty({ example: 'Chemex y Prensa Francesa' })
  @IsOptional()
  value?: string;
}

export class CreateBranchAttributeDto {
  @IsNumber({}, { message: 'The branch ID must be a number.' })
  @ApiProperty({ example: 1 })
  branchId: number;

  @IsArray()
  @ApiProperty({
    type: [AttributeInput],
  })
  attributes: AttributeInput[];
}
