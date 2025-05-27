import { IRole } from "./role.interface";

export interface IUser {
  id: number;
  id_google?: string | null;
  email: string;
  password?: string | null;
  role: IRole;
  status: boolean;
}
