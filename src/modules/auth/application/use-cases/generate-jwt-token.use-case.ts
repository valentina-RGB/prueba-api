import { Inject, Injectable } from '@nestjs/common';
import {
  IJwtService,
  IJwtServiceToken,
} from '../../domain/external-services/jwt.interface.service';

@Injectable()
export class GenerateJwtTokenUseCase {
  constructor(
    @Inject(IJwtServiceToken)
    private readonly jwtService: IJwtService,
  ) {}

  execute(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };
    return this.jwtService.sign(payload);
  }
}
