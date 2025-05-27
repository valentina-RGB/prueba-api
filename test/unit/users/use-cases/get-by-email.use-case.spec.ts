import { Test } from '@nestjs/testing';
import { GetUserByEmailUseCase } from 'src/modules/users/application/use-cases/users/get-by-email-user.use-case';
import {
  IUserRepository,
  IUserRepositoryToken,
} from 'src/modules/users/domain/repositories/user.repository.interface';

describe('GetUserByEmailUseCase', () => {
  let getUserByEmailUseCase: GetUserByEmailUseCase;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const mockUserRepository = {
      findByEmail: jest.fn(),
    };

    const moduleFixture = await Test.createTestingModule({
      providers: [
        GetUserByEmailUseCase,
        {
          provide: IUserRepositoryToken,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    getUserByEmailUseCase = moduleFixture.get<GetUserByEmailUseCase>(
      GetUserByEmailUseCase,
    );
    userRepository = moduleFixture.get<IUserRepository>(IUserRepositoryToken);
  });

  it('should get a user by email', async () => {
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

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);
    const result = await getUserByEmailUseCase.execute(user.email);

    expect(result).toEqual(user);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(user.email);
  });
});
