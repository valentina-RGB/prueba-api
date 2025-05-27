import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { IEmployeeCreateDto } from 'src/modules/users/domain/dto/employe.dto.interface';
import { IPeople } from 'src/modules/users/domain/models/people.interface';

export class CreateEmployeeDto implements IEmployeeCreateDto {
  @ApiProperty({ example: 1, description: 'Person' })
  @IsOptional()
  person?: IPeople;

  @ApiProperty({ example: 'Manager', description: 'Employee type' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'The employee type must have at least 3 characters.',
  })
  @MaxLength(50, {
    message: 'The employee type must not exceed 50 characters.',
  })
  employee_type: string;

  @ApiProperty({ example: 2, description: 'Branch' })
  @IsOptional()
  branch?: IBranches;

  @ApiProperty({ example: 1, description: 'Branch id' })
  @IsOptional()
  branch_id?: number;
}
