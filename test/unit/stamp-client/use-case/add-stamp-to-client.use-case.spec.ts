import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AddStampToClientUseCase } from 'src/modules/albums/application/use-cases/stamp-client/add-stamp-to-client.use-case';
import {
  IStampClientsRepository,
  IStampClientsRepositoryToken,
} from 'src/modules/albums/domain/repositories/stamp-clients.respository.interface';
import { GetStampByBranch } from 'src/modules/albums/application/use-cases/stamp/get-stamp-by-branch-id.use-case';
import { GetClientByUserUseCase } from 'src/modules/users/application/use-cases/clients/get-client-by-user.use-case';
import { AddCoffeeCoinsToClientUseCase } from 'src/modules/users/application/use-cases/clients/add-coffee-coins.use-case';
import { IStampClients } from 'src/modules/albums/domain/models/stamp-clients.interface';

describe('AddStampToClientUseCase', () => {
  let useCase: AddStampToClientUseCase;
  let stampClientsRepository: jest.Mocked<IStampClientsRepository>;
  let getStampByBranch: jest.Mocked<GetStampByBranch>;
  let getClientByUser: jest.Mocked<GetClientByUserUseCase>;
  let addCoffeeCoins: jest.Mocked<AddCoffeeCoinsToClientUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddStampToClientUseCase,
        {
          provide: IStampClientsRepositoryToken,
          useValue: {
            findStampClientById: jest.fn(),
            updateQuantity: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: GetStampByBranch,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetClientByUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: AddCoffeeCoinsToClientUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<AddStampToClientUseCase>(AddStampToClientUseCase);
    stampClientsRepository = module.get(IStampClientsRepositoryToken);
    getStampByBranch = module.get(GetStampByBranch);
    getClientByUser = module.get(GetClientByUserUseCase);
    addCoffeeCoins = module.get(AddCoffeeCoinsToClientUseCase);
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

  const mockStamp = {
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
  };

  const mockExistingStampClient: IStampClients = {
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

  const mockNewStampClient: IStampClients = {
    id: 2,
    client: mockClient,
    stamp: mockStamp,
    obtained_at: new Date(),
    coffecoins_earned: 10,
    quantity: 1,
  };

  describe('execute', () => {
    it('should add a new stamp to client when stamp does not exist', async () => {
      const input = { branchId: 1, user: { id: 1 } };
      getStampByBranch.execute.mockResolvedValue(mockStamp);
      getClientByUser.execute.mockResolvedValue(mockClient);
      stampClientsRepository.findStampClientById.mockResolvedValue(null);
      stampClientsRepository.create.mockResolvedValue(mockNewStampClient);
      addCoffeeCoins.execute.mockResolvedValue(mockClient);

      const result = await useCase.execute(input);

      expect(result).toEqual(mockNewStampClient);
      expect(getStampByBranch.execute).toHaveBeenCalledWith(input.branchId);
      expect(getClientByUser.execute).toHaveBeenCalledWith(input.user.id);
      expect(stampClientsRepository.findStampClientById).toHaveBeenCalledWith(
        mockStamp.id,
        mockClient.id,
      );
      expect(stampClientsRepository.create).toHaveBeenCalledWith({
        stamp: mockStamp,
        client: mockClient,
        obtained_at: expect.any(Date),
        coffecoins_earned: mockStamp.coffeecoins_value,
      });
      expect(addCoffeeCoins.execute).toHaveBeenCalledWith({
        clientId: mockClient.id,
        quantity: mockStamp.coffeecoins_value,
      });
    });

    it('should increment quantity when stamp already exists for client', async () => {
      const input = { branchId: 1, user: { id: 1 } };
      const existingStamp = {
        ...mockExistingStampClient,
        quantity: 1,
      };
      const updatedStampClient = { ...mockExistingStampClient, quantity: 2 };
      getStampByBranch.execute.mockResolvedValue(mockStamp);
      getClientByUser.execute.mockResolvedValue(mockClient);
      stampClientsRepository.findStampClientById.mockResolvedValue(
        mockExistingStampClient,
      );
      stampClientsRepository.updateQuantity.mockResolvedValue(existingStamp);

      addCoffeeCoins.execute.mockResolvedValue(mockClient);

      const result = await useCase.execute(input);

      expect(result).toEqual(updatedStampClient);
      expect(stampClientsRepository.updateQuantity).toHaveBeenCalledWith(
        mockExistingStampClient.id,
        2,
      );
      expect(addCoffeeCoins.execute).toHaveBeenCalledWith({
        clientId: mockClient.id,
        quantity: mockStamp.coffeecoins_value,
      });
    });

    it('should throw NotFoundException when stamp is not found', async () => {
      const input = { branchId: 1, user: { id: 1 } };
      getStampByBranch.execute.mockResolvedValue(null);

      await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when client is not found', async () => {
      const input = { branchId: 1, user: { id: 1 } };
      getStampByBranch.execute.mockResolvedValue(mockStamp);

      await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when coffee coins update fails for new stamp', async () => {
      const input = { branchId: 1, user: { id: 1 } };
      getStampByBranch.execute.mockResolvedValue(mockStamp);
      getClientByUser.execute.mockResolvedValue(mockClient);
      stampClientsRepository.findStampClientById.mockResolvedValue(null);
      stampClientsRepository.create.mockResolvedValue(mockNewStampClient);

      addCoffeeCoins.execute.mockRejectedValue(
        new ConflictException('Update failed'),
      );

      await expect(useCase.execute(input)).rejects.toThrow(ConflictException);
    });
  });
});
