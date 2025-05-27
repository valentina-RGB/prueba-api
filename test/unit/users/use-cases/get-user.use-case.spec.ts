import { Test } from '@nestjs/testing';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../../src/modules/users/domain/repositories/user.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { GetUserUseCase } from 'src/modules/users/application/use-cases/users/get-user.use-case';

describe('GetUserUseCase', () => {
  let getUserUseCase: GetUserUseCase;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const mockUserRepository = {
      findById: jest.fn(),
    };

    const moduleFixture = await Test.createTestingModule({
      providers: [
        GetUserUseCase,
        {
          provide: IUserRepositoryToken,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    getUserUseCase = moduleFixture.get<GetUserUseCase>(GetUserUseCase);
    userRepository = moduleFixture.get<IUserRepository>(IUserRepositoryToken);
  });

  it('should get a user by ID', async () => {
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

    const result = await getUserUseCase.execute(1);

    expect(result).toEqual(user);
    expect(userRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw an error if the user does not exist', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

    await expect(getUserUseCase.execute(1)).rejects.toThrow(NotFoundException);

    expect(userRepository.findById).toHaveBeenCalledWith(1);
  });
});
