import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { IUpdateBranchAttribute } from 'src/modules/stores/domain/dto/branches-attributes.interface.dto';

export class UpdateBranchAttributeDto implements IUpdateBranchAttribute {
  @ApiProperty({ example: 'Chemex y Prensa Francesa' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  value: string;
}
