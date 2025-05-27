import { Injectable } from '@nestjs/common';
import { IAuthService } from '../domain/auth.service.interface';
import { LoginUseCase } from './use-cases/login.use-case';
import { IAuthLogin } from '../domain/interfaces/login-auth.interface';
import { GenerateJwtTokenUseCase } from './use-cases/generate-jwt-token.use-case';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly generateJwtTokenUseCase: GenerateJwtTokenUseCase,
  ) {}

  async login(data: IAuthLogin) {
    return this.loginUseCase.execute(data);
  }

  async generateJwtToken(user: any) {
    return this.generateJwtTokenUseCase.execute(user);
  }
}
