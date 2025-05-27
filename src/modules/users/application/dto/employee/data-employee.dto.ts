import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePeopleDto } from '../people/create-people-dto';
import { CreateUserDto } from '../users/create-user.dto';
import { CreateEmployeeDto } from './create-employee.dto';

export class DataEmployeeDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CreateEmployeeDto)
  employeeData: CreateEmployeeDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  userData: CreateUserDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreatePeopleDto)
  personData: CreatePeopleDto;
}
