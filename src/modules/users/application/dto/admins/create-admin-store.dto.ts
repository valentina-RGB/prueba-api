import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePeopleDto } from '../people/create-people-dto';
import { CreateUserDto } from '../users/create-user.dto';

export class CreateAdminStoreDto {
  @IsObject()
  storeData: {
    id: number;
  };

  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  userData: CreateUserDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreatePeopleDto)
  personData: CreatePeopleDto;
}
