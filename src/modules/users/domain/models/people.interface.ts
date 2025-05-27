import { IUser } from "./user.interface";

export interface IPeople {
  id: number;
  user?: IUser;
  type_document: string;
  number_document: string;
  full_name: string;
  phone_number: string;
}