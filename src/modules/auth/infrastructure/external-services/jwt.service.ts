import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtService } from '../../domain/external-services/jwt.interface.service';

@Injectable()
export class JwtServiceP implements IJwtService {
  constructor(
    private configService: ConfigService,
    private readonly nestJwtService: NestJwtService,
  ) {}

  sign(payload: any, options?: any): string {
    const secret = this.configService.get<string>('JWT_SECRET') ?? 'secretKey';
    return this.nestJwtService.sign(payload, {
      ...options,
      secret,
    });
  }

  verify(token: string, options?: any): any {
    const secret = this.configService.get<string>('JWT_SECRET') ?? 'secretKey';
    return this.nestJwtService.verify(token, {
      ...options,
      secret,
    });
  }

  decode(token: string): any {
    return this.nestJwtService.decode(token);
  }
}
