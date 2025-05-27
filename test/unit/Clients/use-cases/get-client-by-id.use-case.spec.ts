import { Test, TestingModule } from '@nestjs/testing';
import { GetClientUseCase } from 'src/modules/users/application/use-cases/clients/get-client.use-case';
import {
  IClientRepository,
  IClientRepositoryToken,
} from 'src/modules/users/domain/repositories/client.repository.interface';
import { IClient } from 'src/modules/users/domain/models/client.interface';
import { NotFoundException } from '@nestjs/common';

describe('GetClientUseCase', () => {
  let getClientUseCase: GetClientUseCase;
  let clientRepository: IClientRepository;

  beforeEach(async () => {
    const mockClientRepository = {
      findById: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        GetClientUseCase,
        {
          provide: IClientRepositoryToken,
          useValue: mockClientRepository,
        },
      ],
    }).compile();

    getClientUseCase = moduleFixture.get<GetClientUseCase>(GetClientUseCase);
    clientRepository = moduleFixture.get<IClientRepository>(
      IClientRepositoryToken,
    );
  });

  it('should return a client by id successfully', async () => {
    const mockClient: IClient = {
      id: 1,
      person: {
        id: 1,
        user: { id: 1, email: 'test@example.com', role: { id: 1, name: 'Admin', status: true }, status: true },
        type_document: 'CC',
        number_document: '123456',
        full_name: 'John Doe',
        phone_number: '3001234567',
      },
      coffee_coins: 0,
      is_verified: false,
    };

    jest.spyOn(clientRepository, 'findById').mockResolvedValue(mockClient);

    const result = await getClientUseCase.execute(1);

    expect(result).toEqual(mockClient);
    expect(clientRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw a NotFoundException if the client does not exist', async () => {
    jest.spyOn(clientRepository, 'findById').mockResolvedValue(null);

    await expect(getClientUseCase.execute(99)).rejects.toThrow(
      new NotFoundException('Client not found'),
    );

    expect(clientRepository.findById).toHaveBeenCalledWith(99);
  });
});
