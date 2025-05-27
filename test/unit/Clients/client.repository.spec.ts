import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ClientRepository } from 'src/modules/users/infrastructure/repositories/client.repository';
import { ClientEntity } from 'src/modules/users/infrastructure/entities/client.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { IClientCreateDto } from 'src/modules/users/domain/dto/client.dto.interface';
import { IClient } from 'src/modules/users/domain/models/client.interface';
import { IPeople } from 'src/modules/users/domain/models/people.interface';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ClientRepository', () => {
  let clientRepository: ClientRepository;
  let mockRepository: Repository<ClientEntity>;

  beforeEach(async () => {
    const mockRepositoryProvider = {
      provide: 'ClientEntityRepository',
      useClass: Repository,
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ClientRepository,
        {
          provide: getRepositoryToken(ClientEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    clientRepository = moduleFixture.get<ClientRepository>(ClientRepository);
    mockRepository = moduleFixture.get(getRepositoryToken(ClientEntity));
  });

  describe('createClient', () => {
    it('should create a client successfully', async () => {
      const mockClientData: IClientCreateDto = {
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
      };

      const mockClient: IClient = {
        id: 1,
        person: mockClientData.person as IPeople,
        coffee_coins: 0,
        is_verified: false,
      };

      jest
        .spyOn(mockRepository, 'save')
        .mockResolvedValue(mockClient as ClientEntity);

      const result = await clientRepository.createClient(mockClientData);

      expect(result).toEqual(mockClient);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(mockClientData),
      );
    });

    it('should throw an InternalServerErrorException on save failure', async () => {
      const mockClientData: IClientCreateDto = {
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
      };

      jest.spyOn(mockRepository, 'save').mockRejectedValue(new Error());

      await expect(
        clientRepository.createClient(mockClientData),
      ).rejects.toThrow(
        new InternalServerErrorException('Failed to create client'),
      );
    });
  });

  describe('findById', () => {
    it('should return a client by id successfully', async () => {
      const mockPerson: IPeople = {
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
      };

      const mockClient: IClient = {
        id: 1,
        person: mockPerson,
        coffee_coins: 0,
        is_verified: false,
      };

      jest
        .spyOn(mockRepository, 'findOne')
        .mockResolvedValue(mockClient as ClientEntity);

      const result = await clientRepository.findById(1);

      expect(result).toEqual(mockClient);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['person', 'person.user'],
      });
    });

    it('should return null if client is not found', async () => {
      jest.spyOn(mockRepository, 'findOne').mockResolvedValue(null);

      const result = await clientRepository.findById(99);

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 99 },
        relations: ['person', 'person.user'],
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of clients successfully', async () => {
      const mockPeople: IPeople[] = [
        {
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
        },
        {
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
          phone_number: '9876543210',
        },
      ];

      const mockClients: IClient[] = [
        { id: 1, person: mockPeople[0], coffee_coins: 0, is_verified: false,},
        { id: 2, person: mockPeople[1], coffee_coins: 0, is_verified: false,},
      ];

      jest
        .spyOn(mockRepository, 'find')
        .mockResolvedValue(mockClients as ClientEntity[]);

      const result = await clientRepository.findAll();

      expect(result).toEqual(mockClients);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['person', 'person.user'],
      });
    });

    it('should return an empty list if there are no clients', async () => {
      jest.spyOn(mockRepository, 'find').mockResolvedValue([]);

      const result = await clientRepository.findAll();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['person', 'person.user'],
      });
    });
  });

  describe('findByUserId', () => {
    it('should return a client by user id', async () => {
      const userId = 1;
      const mockClient: IClient = {
        id: 1,
        person: { user: { id: userId } } as IPeople,
        coffee_coins: 0,
        is_verified: false,
      };

      jest
        .spyOn(mockRepository, 'findOne')
        .mockResolvedValue(mockClient as ClientEntity);

      const result = await clientRepository.findByUserId(userId);

      expect(result).toEqual(mockClient);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { person: { user: { id: userId } } },
        relations: ['person', 'person.user'],
      });
    });
  });

  describe('addCoffeeCoins', () => {
    it('should update coffee coins successfully', async () => {
      const updatePayload = { id: 1, coffee_coins: 50, is_verified: false };
      const updatedClient: IClient = {
        ...updatePayload,
        person: {} as IPeople,
      };

      jest
        .spyOn(mockRepository, 'save')
        .mockResolvedValue(updatedClient as ClientEntity);

      const result = await clientRepository.addCoffeeCoins(updatePayload);

      expect(result).toEqual(updatedClient);
      expect(mockRepository.save).toHaveBeenCalledWith(updatePayload);
    });
  });
});
