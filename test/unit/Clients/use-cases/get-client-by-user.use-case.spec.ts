import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetClientByUserUseCase } from 'src/modules/users/application/use-cases/clients/get-client-by-user.use-case';
import {
  IClientRepository,
  IClientRepositoryToken,
} from 'src/modules/users/domain/repositories/client.repository.interface';
import { IClient } from 'src/modules/users/domain/models/client.interface';

describe('GetClientByUserUseCase', () => {
  let useCase: GetClientByUserUseCase;
  let clientRepository: jest.Mocked<IClientRepository>;

  const mockUser = {
    id: 1,
    email: 'client@example.com',
    password: 'hashedpassword',
    id_google: null,
    role: { id: 1, name: 'CLIENT', status: true },
    status: true,
  };

  const mockPerson = {
    id: 1,
    type_document: 'CC',
    number_document: '123456789',
    full_name: 'John Doe',
    phone_number: '3001234567',
    user: mockUser,
  };
  const mockClient: IClient = {
    id: 1,
    person: mockPerson,
    coffee_coins: 0,
    is_verified: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetClientByUserUseCase,
        {
          provide: IClientRepositoryToken,
          useValue: {
            findByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(GetClientByUserUseCase);
    clientRepository = module.get(IClientRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the client when found by user ID', async () => {
    clientRepository.findByUserId.mockResolvedValue(mockClient);

    const result = await useCase.execute(42);

    expect(clientRepository.findByUserId).toHaveBeenCalledWith(42);
    expect(result).toEqual(mockClient);
  });

  it('should throw NotFoundException when client is not found', async () => {
    clientRepository.findByUserId.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(NotFoundException);
    expect(clientRepository.findByUserId).toHaveBeenCalledWith(99);
  });
});
