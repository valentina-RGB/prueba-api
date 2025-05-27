import { IUser } from '../models/user.interface';

export interface IPersonCreateDto {
  user?: IUser;
  type_document: string;
  number_document: string;
  full_name: string;
  phone_number: string;
}

export interface IPersonUpdateDto {
  type_document?: string;
  number_document?: string;
  full_name?: string;
  phone_number?: string;
}
