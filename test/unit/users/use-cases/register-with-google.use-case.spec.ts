import { Test } from '@nestjs/testing';
import { RegisterWithGoogleUseCase } from 'src/modules/users/application/use-cases/users/register-with-google.use-case';
import {
  IUserRepository,
  IUserRepositoryToken,
} from 'src/modules/users/domain/repositories/user.repository.interface';
import { GetRoleUseCase } from 'src/modules/users/application/use-cases/roles/get-role.use-case';
import { ConflictException } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/application/dto/users/create-user.dto';
import { IUser } from 'src/modules/users/domain/models/user.interface';
import { QueryRunner } from 'typeorm';

describe('RegisterWithGoogleUseCase', () => {
  let registerWithGoogleUseCase: RegisterWithGoogleUseCase;
  let userRepository: IUserRepository;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    withTransaction: jest.fn(),
  };

  const mockGetRoleUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture = await Test.createTestingModule({
      providers: [
        RegisterWithGoogleUseCase,
        {
          provide: IUserRepositoryToken,
          useValue: mockUserRepository,
        },
        {
          provide: GetRoleUseCase,
          useValue: mockGetRoleUseCase,
        },
      ],
    }).compile();

    registerWithGoogleUseCase = moduleFixture.get<RegisterWithGoogleUseCase>(
      RegisterWithGoogleUseCase,
    );
    userRepository = moduleFixture.get<IUserRepository>(IUserRepositoryToken);
  });

  it('should register a new user with Google', async () => {
    const mockRole = { id: 1, name: 'User', status: true };

    const userData: CreateUserDto = {
      email: 'john@example.com',
      role: mockRole,
    };

    const mockUser: IUser = {
      id: 1,
      email: userData.email,
      role: mockRole,
      status: true,
    };

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(userRepository, 'create').mockResolvedValue(mockUser);

    const result = await registerWithGoogleUseCase.execute({ userData });

    expect(result).toEqual(mockUser);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(userRepository.create).toHaveBeenCalledWith({
      ...userData,
      password: undefined,
      role: mockRole,
    });
  });

  it('should throw a ConflictException if email already exists', async () => {
    const userData: CreateUserDto = {
      email: 'test@example.com',
      role: { id: 1, name: 'User', status: true },
    };

    const existingUser: IUser = {
      id: 1,
      email: userData.email,
      role: { id: 1, name: 'User', status: true },
      status: true,
    };

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(existingUser);

    await expect(
      registerWithGoogleUseCase.execute({ userData }),
    ).rejects.toThrow(ConflictException);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('should use repository with transaction if queryRunner is provided', async () => {
    const mockRole = { id: 1, name: 'User', status: true };

    const userData: CreateUserDto = {
      email: 'john@example.com',
      role: mockRole,
    };

    const mockUser: IUser = {
      id: 1,
      email: userData.email,
      role: mockRole,
      status: true,
    };

    const queryRunner = {
      manager: {} as any,
    } as QueryRunner;

    const transactionalRepo: IUserRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(mockUser),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      withTransaction: jest.fn(),
    };

    mockUserRepository.withTransaction.mockReturnValue(transactionalRepo);

    const result = await registerWithGoogleUseCase.execute({
      userData,
      queryRunner,
    });

    expect(mockUserRepository.withTransaction).toHaveBeenCalledWith(
      queryRunner.manager,
    );
    expect(transactionalRepo.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(transactionalRepo.create).toHaveBeenCalledWith({
      ...userData,
      password: undefined,
    });
    expect(result).toEqual(mockUser);
  });
});
