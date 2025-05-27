import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RouterModule } from '@nestjs/core';

import { AuthController } from './infrastructure/controllers/auth.controller';

import { JwtStrategy } from 'src/modules/auth/infrastructure/strategies/jwt.strategy';
import { GoogleStrategy } from './infrastructure/strategies/google.strategy';

import { IAuthServiceToken } from './domain/auth.service.interface';
import { IJwtServiceToken } from './domain/external-services/jwt.interface.service';

import { AuthService } from './application/auth.service';
import { JwtServiceP } from './infrastructure/external-services/jwt.service';

import { LoginUseCase } from './application/use-cases/login.use-case';
import { UsersModule } from '../users/users.module';
import { GenerateJwtTokenUseCase } from './application/use-cases/generate-jwt-token.use-case';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '8h'),
        },
      }),
      inject: [ConfigService],
    }),
    RouterModule.register([
      {
        path: 'api/v2',
        module: AuthModule,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    // Strategies
    JwtStrategy,
    GoogleStrategy,

    // Services
    { provide: IAuthServiceToken, useClass: AuthService },
    { provide: IJwtServiceToken, useClass: JwtServiceP },

    LoginUseCase,
    GenerateJwtTokenUseCase,
  ],
  exports: [JwtStrategy, GoogleStrategy, IJwtServiceToken, LoginUseCase],
})
export class AuthModule {}
