import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { GetUserByEmailUseCase } from '../../../users/application/use-cases/users/get-by-email-user.use-case';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private readonly findByEmailUseCase: GetUserByEmailUseCase,
  ) {
    const isTest = process.env.NODE_ENV === 'test';

    super({
      clientID: isTest
        ? 'test-client-id'
        : configService.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: isTest
        ? 'test-client-secret'
        : configService.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: isTest
        ? 'http://localhost/test-callback'
        : configService.get<string>('GOOGLE_CALLBACK_URL')!,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const isTest = process.env.NODE_ENV === 'test';

    if (isTest) {
      const mockUser = {
        id: 'mock-user-id',
        email: 'test@example.com',
        id_google: profile.id || 'mock-google-id',
        full_name: 'Test User',
      };
      return done(null, mockUser);
    }

    try {
      const { emails } = profile;
      const email = emails[0].value.toLowerCase();

      const existingUser = await this.findByEmailUseCase.execute(email);

      if (!existingUser)
        return done(new UnauthorizedException('User not registered'), false);

      if (!existingUser.id_google)
        return done(
          new UnauthorizedException('User registered with email/password'),
          false,
        );

      if (existingUser.id_google !== profile.id)
        return done(new UnauthorizedException('Invalid Google account'), false);

      done(null, existingUser);
    } catch (error) {
      done(error, false);
    }
  }
}
