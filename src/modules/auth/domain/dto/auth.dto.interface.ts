import { IRole } from '../../../users/domain/models/role.interface';

export interface IAuthLoginDto {
  accessToken: string;
  user: {
    id?: number;
    role?: IRole;
    email: string;
  };
}
