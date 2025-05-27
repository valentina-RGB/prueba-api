import { Test, TestingModule } from '@nestjs/testing';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../../src/modules/users/domain/repositories/user.repository.interface';
import { ListUserUseCase } from 'src/modules/users/application/use-cases/users/list-user.use-case';

describe('ListUserUseCase', () => {
  let listUserUseCase: ListUserUseCase;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const mockUserRepository = {
      findAll: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ListUserUseCase,
        {
          provide: IUserRepositoryToken,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    listUserUseCase = moduleFixture.get<ListUserUseCase>(ListUserUseCase);
    userRepository = moduleFixture.get<IUserRepository>(IUserRepositoryToken);
  });

  it('should return all users successfully', async () => {
    const mockRole = {
      id: 1,
      name: 'Admin',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      users: [],
    };

    const mockUsers = [
      {
        id: 1,
        email: 'user1@example.com',
        password: 'hashed-123456',
        status: true,
        role: mockRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 1,
        email: 'user2@example.com',
        password: 'hashed-123456',
        status: true,
        role: mockRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.spyOn(userRepository, 'findAll').mockResolvedValue(mockUsers);

    const result = await listUserUseCase.execute();

    expect(userRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
    expect(result.length).toBe(2);
  });

  it('should return an empty array when no users exist', async () => {
    jest.spyOn(userRepository, 'findAll').mockResolvedValue([]);

    const result = await listUserUseCase.execute();

    expect(userRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});
