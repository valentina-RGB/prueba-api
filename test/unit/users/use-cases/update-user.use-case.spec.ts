import { Test, TestingModule } from '@nestjs/testing';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../../src/modules/users/domain/repositories/user.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserUseCase } from 'src/modules/users/application/use-cases/users/update-user.use-case';
import {
  IPasswordHasherServiceToken,
  IPasswordHasherService,
} from 'src/modules/users/domain/external-services/password-hasher.interface.service';
import {
  IRoleRepositoryToken,
  IRoleRepository,
} from 'src/modules/users/domain/repositories/role.repository.interface';
import { GetRoleUseCase } from 'src/modules/users/application/use-cases/roles/get-role.use-case';
import { UpdateUserDto } from 'src/modules/users/application/dto/users/update-user.dto';

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let userRepository: IUserRepository;
  let passwordHasher: IPasswordHasherService;
  let getRoleUseCase: GetRoleUseCase;
  let roleRepository: IRoleRepository;

  beforeEach(async () => {
    const mockUserRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    const mockRoleRepository = {
      findById: jest.fn(),
    };

    const mockPasswordHasherService = {
      hash: jest.fn().mockImplementation((password) => `hashed-${password}`),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        GetRoleUseCase,
        {
          provide: IUserRepositoryToken,
          useValue: mockUserRepository,
        },
        {
          provide: IRoleRepositoryToken,
          useValue: mockRoleRepository,
        },
        {
          provide: IPasswordHasherServiceToken,
          useValue: mockPasswordHasherService,
        },
      ],
    }).compile();

    updateUserUseCase = moduleFixture.get<UpdateUserUseCase>(UpdateUserUseCase);
    userRepository = moduleFixture.get<IUserRepository>(IUserRepositoryToken);
    passwordHasher = moduleFixture.get<IPasswordHasherService>(
      IPasswordHasherServiceToken,
    );
    getRoleUseCase = moduleFixture.get<GetRoleUseCase>(GetRoleUseCase);
    roleRepository = moduleFixture.get<IRoleRepository>(IRoleRepositoryToken);
  });

  it('should update a user successfully', async () => {
    const id = 1;
    const updateUserDto: UpdateUserDto = {
      email: 'jane.updated@example.com',
    };

    const mockRole = {
      id: 1,
      name: 'Admin',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      users: [],
    };

    const existingUser = {
      id: 1,
      email: 'jane@example.com',
      password: 'hashed-123456',
      status: true,
      role: mockRole,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedUser = {
      ...existingUser,
      ...updateUserDto,
    };

    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(existingUser);
    jest.spyOn(userRepository, 'update').mockResolvedValueOnce(undefined);
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(updatedUser);

    const result = await updateUserUseCase.execute({ id, data: updateUserDto });
    expect(result).toEqual(updatedUser);

    expect(userRepository.findById).toHaveBeenCalledWith(id);
    expect(userRepository.update).toHaveBeenCalledWith(id, updateUserDto);
  });

  it('should throw a NotFoundException if the user does not exist', async () => {
    const id = 99;
    const updateUserDto: UpdateUserDto = {
      email: 'nonexistent@example.com',
    };

    jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

    await expect(
      updateUserUseCase.execute({ id, data: updateUserDto }),
    ).rejects.toThrow(NotFoundException);

    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('should hash the password when updating with a new password', async () => {
    const id = 1;
    const plainPassword = 'newPassword123';
    const updateUserDto: UpdateUserDto = {
      password: plainPassword,
    };

    const mockRole = {
      id: 1,
      name: 'Client',
      status: true,
    };

    const existingUser = {
      id: 1,
      role: mockRole,
      email: 'jane@example.com',
      password: 'hashed-oldPassword',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const hashedPassword = `hashed-${plainPassword}`;
    const updatedUser = {
      ...existingUser,
      password: hashedPassword,
    };

    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(existingUser);
    jest.spyOn(passwordHasher, 'hash').mockResolvedValueOnce(hashedPassword);
    jest.spyOn(userRepository, 'update').mockResolvedValueOnce(undefined);
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(updatedUser);

    const result = await updateUserUseCase.execute({ id, data: updateUserDto });

    expect(passwordHasher.hash).toHaveBeenCalledWith(plainPassword);
    expect(userRepository.update).toHaveBeenCalledWith(id, {
      password: hashedPassword,
    });
    expect(result).toEqual(updatedUser);
  });

  it('should validate the role exists when updating with a new role_id', async () => {
    const id = 1;
    const roleId = 2;
    const updateUserDto: UpdateUserDto = {
      role_id: roleId,
    };

    const mockRole = {
      id: 1,
      name: 'Client',
      status: true,
    };

    const existingUser = {
      id: 1,
      email: 'jane@example.com',
      password: 'hashed-password',
      role: mockRole,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newRole = {
      id: roleId,
      name: 'User',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedUser = {
      ...existingUser,
      role: newRole,
    };

    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(existingUser);
    jest.spyOn(getRoleUseCase, 'execute').mockResolvedValueOnce(newRole);
    jest.spyOn(userRepository, 'update').mockResolvedValueOnce(undefined);
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(updatedUser);

    const result = await updateUserUseCase.execute({ id, data: updateUserDto });

    expect(getRoleUseCase.execute).toHaveBeenCalledWith(roleId);
    expect(userRepository.update).toHaveBeenCalledWith(id, updateUserDto);
    expect(result).toEqual(updatedUser);
  });
});
