import { Test, TestingModule } from '@nestjs/testing';
import { ListClientUseCase } from 'src/modules/users/application/use-cases/clients/list-client.use-case';
import {
  IClientRepository,
  IClientRepositoryToken,
} from 'src/modules/users/domain/repositories/client.repository.interface';
import { IClient } from 'src/modules/users/domain/models/client.interface';
import { IPeople } from 'src/modules/users/domain/models/people.interface';

describe('ListClientUseCase', () => {
  let listClientUseCase: ListClientUseCase;
  let clientRepository: IClientRepository;

  beforeEach(async () => {
    const mockClientRepository = {
      findAll: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ListClientUseCase,
        {
          provide: IClientRepositoryToken,
          useValue: mockClientRepository,
        },
      ],
    }).compile();

    listClientUseCase = moduleFixture.get<ListClientUseCase>(ListClientUseCase);
    clientRepository = moduleFixture.get<IClientRepository>(
      IClientRepositoryToken,
    );
  });

  it('should return a list of clients successfully', async () => {
    const mockClients: IClient[] = [
      {
        id: 1,
        person: {
          id: 1,
          user: {
            id: 1,
            email: 'test@example.com',
            role: { id: 1, name: 'Admin', status: true },
            status: true,
          },
          type_document: 'CC',
          number_document: '123456',
          full_name: 'John Doe',
          phone_number: '3001234567',
        } as IPeople,
        coffee_coins: 10,
        is_verified: false,
      },
      {
        id: 2,
        person: {
          id: 2,
          user: {
            id: 2,
            email: 'jane@example.com',
            role: { id: 2, name: 'User', status: true },
            status: true,
          },
          type_document: 'TI',
          number_document: '654321',
          full_name: 'Jane Doe',
          phone_number: '3009876543',
        } as IPeople,
        coffee_coins: 5,
        is_verified: false,
      },
    ];

    jest.spyOn(clientRepository, 'findAll').mockResolvedValue(mockClients);

    const result = await listClientUseCase.execute();

    expect(result).toEqual(mockClients);
    expect(clientRepository.findAll).toHaveBeenCalled();
  });

  it('should return an empty list if there are no clients', async () => {
    jest.spyOn(clientRepository, 'findAll').mockResolvedValue([]);

    const result = await listClientUseCase.execute();

    expect(result).toEqual([]);
    expect(clientRepository.findAll).toHaveBeenCalled();
  });
});
