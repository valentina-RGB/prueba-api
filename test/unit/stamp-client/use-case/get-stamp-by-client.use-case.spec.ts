import { Test, TestingModule } from '@nestjs/testing';
import {
  IStampClientsRepository,
  IStampClientsRepositoryToken,
} from 'src/modules/albums/domain/repositories/stamp-clients.respository.interface';
import { GetClientByUserUseCase } from 'src/modules/users/application/use-cases/clients/get-client-by-user.use-case';
import { NotFoundException } from '@nestjs/common';
import { IStampClients } from 'src/modules/albums/domain/models/stamp-clients.interface';
import { GetStampByClientUseCase } from 'src/modules/albums/application/use-cases/stamp-client/get-stamp-by-client.use-case';

describe('GetStampByClientUseCase', () => {
  let useCase: GetStampByClientUseCase;
  let stampClientsRepository: jest.Mocked<IStampClientsRepository>;
  let getClientByUser: jest.Mocked<GetClientByUserUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStampByClientUseCase,
        {
          provide: IStampClientsRepositoryToken,
          useValue: {
            findAllStampByClient: jest.fn(),
          },
        },
        {
          provide: GetClientByUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetStampByClientUseCase>(GetStampByClientUseCase);
    stampClientsRepository = module.get(IStampClientsRepositoryToken);
    getClientByUser = module.get(GetClientByUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockClient = {
    id: 1,
    person: {
      id: 1,
      user: {
        id: 1,
        email: 'client@test.com',
        role: { id: 1, name: 'CLIENT', status: true },
        status: true,
      },
      type_document: 'CC',
      number_document: '123456789',
      full_name: 'Test Client',
      phone_number: '3001234567',
    },
    coffee_coins: 0,
    is_verified: false,
  };

  const mockStampClient: IStampClients = {
    id: 1,
    client: mockClient,
    stamp: {
      id: 1,
      branch: {
        id: 1,
        store: {
          id: 1,
          name: 'Test Store',
          type_document: 'NIT',
          number_document: '123456789-0',
          phone_number: '3001234567',
          email: 'store@test.com',
          status: 'APPROVED',
        },
        name: 'Test Branch',
        phone_number: '3007654321',
        latitude: 6.23,
        longitude: -75.59,
        address: 'Test Address',
        is_open: true,
        status: 'APPROVED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      logo: 'https://example.com/logo.jpg',
      name: 'Test Stamp',
      description: 'Test Description',
      coffeecoins_value: 10,
      status: true,
    },
    obtained_at: new Date(),
    coffecoins_earned: 10,
    quantity: 1,
  };

  describe('execute', () => {
    it('should return an array of stamp clients when found for user id', async () => {
      const userId = 1;
      getClientByUser.execute.mockResolvedValue(mockClient);
      stampClientsRepository.findAllStampByClient.mockResolvedValue([
        mockStampClient,
      ]);

      const result = await useCase.execute(userId);

      expect(result).toEqual([mockStampClient]);
      expect(getClientByUser.execute).toHaveBeenCalledWith(userId);
      expect(stampClientsRepository.findAllStampByClient).toHaveBeenCalledWith(
        mockClient.id,
      );
      expect(result?.length).toBe(1);
      expect(result?.[0].stamp.name).toBe('Test Stamp');
    });

    it('should return null when no stamp clients found for user id', async () => {
      const userId = 2;
      getClientByUser.execute.mockResolvedValue(mockClient);
      stampClientsRepository.findAllStampByClient.mockResolvedValue(null);

      const result = await useCase.execute(userId);

      expect(result).toBeNull();
      expect(getClientByUser.execute).toHaveBeenCalledWith(userId);
      expect(stampClientsRepository.findAllStampByClient).toHaveBeenCalledWith(
        mockClient.id,
      );
    });

    it('should throw NotFoundException when user id is invalid (NaN)', async () => {
      const invalidUserId = NaN;

      await expect(useCase.execute(invalidUserId)).rejects.toThrow(
        NotFoundException,
      );
      expect(getClientByUser.execute).not.toHaveBeenCalled();
      expect(
        stampClientsRepository.findAllStampByClient,
      ).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user id is invalid (0)', async () => {
      await expect(useCase.execute(0)).rejects.toThrow(NotFoundException);
      expect(getClientByUser.execute).not.toHaveBeenCalled();
      expect(
        stampClientsRepository.findAllStampByClient,
      ).not.toHaveBeenCalled();
    });

    it('should verify the complete structure of returned stamp clients', async () => {
      const userId = 1;
      getClientByUser.execute.mockResolvedValue(mockClient);
      stampClientsRepository.findAllStampByClient.mockResolvedValue([
        mockStampClient,
      ]);

      const result = await useCase.execute(userId);
      const firstStampClient = result?.[0];

      expect(firstStampClient).toHaveProperty('id');
      expect(firstStampClient).toHaveProperty('client');
      expect(firstStampClient).toHaveProperty('stamp');
      expect(firstStampClient).toHaveProperty('obtained_at');
      expect(firstStampClient).toHaveProperty('coffecoins_earned');
      expect(firstStampClient).toHaveProperty('quantity');
      expect(firstStampClient?.stamp).toHaveProperty('branch');
      expect(firstStampClient?.client.person).toHaveProperty('user');
    });
  });
});
