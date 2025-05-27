import { IAuthLoginDto } from 'src/modules/auth/domain/dto/auth.dto.interface';
import { IAuthLogin } from './interfaces/login-auth.interface';

export interface IAuthService {
  login(data: IAuthLogin): Promise<IAuthLoginDto>;
  generateJwtToken(user: any);
}

export const IAuthServiceToken = Symbol('IAuthService');
