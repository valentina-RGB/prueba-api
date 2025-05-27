import {
  Injectable,
  Inject,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import {
  IJwtServiceToken,
  IJwtService,
} from 'src/modules/auth/domain/external-services/jwt.interface.service';
import {
  IPasswordHasherServiceToken,
  IPasswordHasherService,
} from 'src/modules/users/domain/external-services/password-hasher.interface.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { IUser } from 'src/modules/users/domain/models/user.interface';
import { GetUserByEmailUseCase } from 'src/modules/users/application/use-cases/users/get-by-email-user.use-case';
import { GenerateJwtTokenUseCase } from './generate-jwt-token.use-case';

@Injectable()
export class LoginUseCase implements IUseCase<LoginDto, LoginResponseDto> {
  constructor(
    @Inject(IPasswordHasherServiceToken)
    private readonly passwordHasher: IPasswordHasherService,
    @Inject(IJwtServiceToken)
    private readonly jwtService: IJwtService,

    private readonly getUserByEmail: GetUserByEmailUseCase,
    private readonly generateToken: GenerateJwtTokenUseCase,
  ) {}

  async execute(credentials: LoginDto): Promise<LoginResponseDto> {
    const user = await this.findUser(credentials.email);
    await this.validatePasswordLogin(user, credentials);

    const storeOrBranchId = await this.loginAdmin(user);

    const accessToken = this.generateToken .execute(user);

    if (storeOrBranchId) return { accessToken, user, storeOrBranchId };
    
    return { accessToken, user };
  }

  private async findUser(email: string): Promise<IUser> {
    const user = await this.getUserByEmail.execute(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async validatePasswordLogin(
    user: IUser,
    credentials: LoginDto,
  ): Promise<void> {
    if (!user.password)
      throw new ForbiddenException(
        'User must log in with Google. Please use the Google login option.',
      );

    const passwordCompare = await this.passwordHasher.compare(
      credentials.password!,
      user.password,
    );

    if (!passwordCompare) throw new UnauthorizedException('Invalid credentials');
  }

  private async loginAdmin(user: any) {
    if (user.person?.administrator) {
      const admin = user.person.administrator;

      if (admin.admin_type === 'STORE' && admin.store) {
        return admin.store.id;
      } else if (admin.admin_type === 'BRANCH' && admin.branch) {
        return admin.branch.id;
      }
    }
    return null;
  }
}
