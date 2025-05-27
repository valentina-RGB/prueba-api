import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../../../../src/modules/users/application/use-cases/users/create-user.use-case';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../../src/modules/users/domain/repositories/user.repository.interface';
import { IPasswordHasherServiceToken } from '../../../../src/modules/users/domain/external-services/password-hasher.interface.service';
import { ConflictException } from '@nestjs/common';
import { IUser } from '../../../../src/modules/users/domain/models/user.interface';
import { IUserCreateDto } from 'src/modules/users/domain/dto/user.dto.interface';
import { QueryRunner, EntityManager } from 'typeorm';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordHasher: { hash: jest.Mock };

  beforeEach(async () => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      withTransaction: jest.fn(),
    } as any;

    passwordHasher = {
      hash: jest.fn((password: string) => `hashed-${password}`),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: IUserRepositoryToken,
          useValue: userRepository,
        },
        {
          provide: IPasswordHasherServiceToken,
          useValue: passwordHasher,
        },
      ],
    }).compile();

    createUserUseCase = module.get(CreateUserUseCase);
  });

  const mockRole = {
    id: 1,
    name: 'Admin',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const userDto: IUserCreateDto = {
    email: 'john@example.com',
    password: '123456',
    status: true,
    role: mockRole,
  };

  const createdUser: IUser = {
    id: 1,
    email: 'john@example.com',
    password: 'hashed-123456',
    status: true,
    role: mockRole,
  };

  it('should create a user successfully (without transaction)', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(createdUser);

    const result = await createUserUseCase.execute({ userData: userDto });

    expect(result).toEqual(createdUser);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(userDto.email);
    expect(userRepository.create).toHaveBeenCalledWith({
      ...userDto,
      password: 'hashed-123456',
    });
  });

  it('should throw ConflictException if email already exists', async () => {
    userRepository.findByEmail.mockResolvedValue(createdUser);

    await expect(
      createUserUseCase.execute({ userData: userDto }),
    ).rejects.toThrow(ConflictException);
  });

  it('should use repository with transaction if queryRunner is provided', async () => {
    const queryRunner: Partial<QueryRunner> = {
      manager: {} as EntityManager,
    };

    const transactionalRepo: IUserRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(createdUser),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      withTransaction: jest.fn(),
    };

    userRepository.withTransaction.mockReturnValue(transactionalRepo);

    const result = await createUserUseCase.execute({
      userData: {
        email: 'john@example.com',
        password: '123456',
        status: true,
        role: mockRole,
      },
      queryRunner: queryRunner as QueryRunner,
    });

    expect(userRepository.withTransaction).toHaveBeenCalledWith(
      queryRunner.manager,
    );
    expect(transactionalRepo.findByEmail).toHaveBeenCalledWith(userDto.email);
    expect(transactionalRepo.create).toHaveBeenCalledWith({
      ...userDto,
      password: 'hashed-123456',
    });

    expect(result).toEqual(createdUser);
    expect(passwordHasher.hash).toHaveBeenCalledTimes(1);
  });
});
