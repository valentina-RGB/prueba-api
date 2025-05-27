import { IRole } from '../models/role.interface';

export interface IUserCreateDto {
  id_google?: string;
  email: string;
  password?: string;
  role?: IRole;
  status?: boolean;
}

export interface IUserUpdateDto {
  email?: string;
  password?: string;
  status?: boolean;
  role_id?: number;
  id_google?: string;
}
