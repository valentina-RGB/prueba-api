import { Test, TestingModule } from '@nestjs/testing';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../../src/modules/users/domain/repositories/user.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { DeleteUserUseCase } from 'src/modules/users/application/use-cases/users/delete-user.use-case';

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const mockUserRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: IUserRepositoryToken,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    deleteUserUseCase = moduleFixture.get<DeleteUserUseCase>(DeleteUserUseCase);
    userRepository = moduleFixture.get<IUserRepository>(IUserRepositoryToken);
  });

  it('should delete a user successfully', async () => {
    const mockRole = {
      id: 1,
      name: 'Admin',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      users: [],
    };
    const user = {
      id: 1,
      email: 'john@example.com',
      password: 'hashed-123456',
      status: true,
      role: mockRole,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
    jest.spyOn(userRepository, 'delete').mockResolvedValue(undefined);

    await expect(deleteUserUseCase.execute(1)).resolves.toBeUndefined();
  });

  it('should throw an error if the user does not exist', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

    await expect(deleteUserUseCase.execute(1)).rejects.toThrow(
      NotFoundException,
    );
  });
});
