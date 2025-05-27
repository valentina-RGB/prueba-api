import { Test, TestingModule } from '@nestjs/testing';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  IPasswordHasherService,
  IPasswordHasherServiceToken,
} from 'src/modules/users/domain/external-services/password-hasher.interface.service';
import {
  IJwtService,
  IJwtServiceToken,
} from 'src/modules/auth/domain/external-services/jwt.interface.service';
import { LoginUseCase } from 'src/modules/auth/application/use-cases/login.use-case';
import { GetUserByEmailUseCase } from 'src/modules/users/application/use-cases/users/get-by-email-user.use-case';
import { GenerateJwtTokenUseCase } from 'src/modules/auth/application/use-cases/generate-jwt-token.use-case';
import { IUser } from 'src/modules/users/domain/models/user.interface';
import { LoginDto } from 'src/modules/auth/application/dto/login.dto';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let passwordHasher: jest.Mocked<IPasswordHasherService>;
  let getUserByEmail: jest.Mocked<GetUserByEmailUseCase>;
  let generateToken: jest.Mocked<GenerateJwtTokenUseCase>;

  const mockUser: IUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    id_google: null,
    status: true,
    role: { id: 1, name: Role.ADMIN_SYS, status: true },
  };

  const branchAdmin = {
    id: 2,
    email: 'test@example.com',
    password: 'hashedpassword',
    id_google: null,
    status: true,
    role: { id: 1, name: Role.ADMIN_BRANCH, status: true },
    person: {
      administrator: {
        id: 1,
        admin_type: 'BRANCH',
        branch: { id: 42 },
      },
    },
  };

  const storeAdmin = {
    id: 3,
    email: 'test@example.com',
    password: 'hashedpassword',
    id_google: null,
    status: true,
    role: { id: 1, name: Role.ADMIN_STORE, status: true },
    person: {
      administrator: {
        id: 2,
        admin_type: 'STORE',
        store: { id: 1 },
      },
    },
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: IPasswordHasherServiceToken,
          useValue: { compare: jest.fn() },
        },
        {
          provide: IJwtServiceToken,
          useValue: { sign: jest.fn() },
        },
        {
          provide: GetUserByEmailUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GenerateJwtTokenUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    loginUseCase = moduleRef.get(LoginUseCase);
    passwordHasher = moduleRef.get(IPasswordHasherServiceToken);
    getUserByEmail = moduleRef.get(GetUserByEmailUseCase);
    generateToken = moduleRef.get(GenerateJwtTokenUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should login successfully', async () => {
    const loginDto: LoginDto = { email: mockUser.email, password: '123' };

    getUserByEmail.execute.mockResolvedValue(mockUser);
    passwordHasher.compare.mockResolvedValue(true);
    generateToken.execute.mockReturnValue('token');

    const result = await loginUseCase.execute(loginDto);

    expect(result).toEqual({ accessToken: 'token', user: mockUser });
    expect(getUserByEmail.execute).toHaveBeenCalledWith(loginDto.email);
    expect(passwordHasher.compare).toHaveBeenCalledWith(
      loginDto.password,
      mockUser.password,
    );
    expect(generateToken.execute).toHaveBeenCalledWith(mockUser);
  });

  it('should login and return store id for STORE admin', async () => {
    const loginDto: LoginDto = { email: storeAdmin.email, password: '123' };
    getUserByEmail.execute.mockResolvedValue(storeAdmin);
    passwordHasher.compare.mockResolvedValue(true);
    generateToken.execute.mockReturnValue('token');

    const result = await loginUseCase.execute(loginDto);

    expect(result).toEqual({
      accessToken: 'token',
      user: storeAdmin,
      storeOrBranchId: storeAdmin.person.administrator.store.id,
    });
  });

  it('should login and return branch id for BRANCH admin', async () => {
    const loginDto: LoginDto = {
      email: branchAdmin.email,
      password: '123',
    };

    getUserByEmail.execute.mockResolvedValue(branchAdmin);
    passwordHasher.compare.mockResolvedValue(true);
    generateToken.execute.mockReturnValue('token');

    const result = await loginUseCase.execute(loginDto);

    expect(result).toEqual({
      accessToken: 'token',
      user: branchAdmin,
      storeOrBranchId: branchAdmin.person.administrator.branch.id,
    });
  });

  it('should throw NotFoundException when user is not found', async () => {
    getUserByEmail.execute.mockResolvedValue(null);
    await expect(
      loginUseCase.execute({ email: 'none@example.com', password: '123' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when password is null (Google login)', async () => {
    const googleUser = { ...mockUser, password: null };
    getUserByEmail.execute.mockResolvedValue(googleUser);

    await expect(
      loginUseCase.execute({ email: googleUser.email, password: '123' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    getUserByEmail.execute.mockResolvedValue(mockUser);
    passwordHasher.compare.mockResolvedValue(false);

    await expect(
      loginUseCase.execute({ email: mockUser.email, password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
