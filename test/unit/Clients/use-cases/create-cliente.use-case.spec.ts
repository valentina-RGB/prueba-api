import { Test, TestingModule } from '@nestjs/testing';
import { CreateClientUseCase } from 'src/modules/users/application/use-cases/clients/create-clients.use-case';
import { CreatePeopleUseCase } from 'src/modules/users/application/use-cases/people/create-people.use-case';
import {
  IClientRepository,
  IClientRepositoryToken,
} from 'src/modules/users/domain/repositories/client.repository.interface';
import { GetRoleByNameUseCase } from 'src/modules/users/application/use-cases/roles/get-role-by-name.use-case';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { IClient } from 'src/modules/users/domain/models/client.interface';
import { IPeople } from 'src/modules/users/domain/models/people.interface';
import { DataSource } from 'typeorm';
import { SendWelcomeEmailUseCase } from 'src/modules/mailer/application/use-cases/send-client-welcome-email.use-case';

describe('CreateClientUseCase', () => {
  let createClientUseCase: CreateClientUseCase;
  let clientRepository: IClientRepository;
  let createPeopleUseCase: CreatePeopleUseCase;
  let getRoleByNameUseCase: GetRoleByNameUseCase;
  let transactionalRepo: IClientRepository;
  let sendEmailUseCase: { execute: jest.Mock };

  const mockRole = { id: 1, name: Role.CLIENT, status: true };

  const mockPerson: IPeople = {
    id: 1,
    user: {
      id: 1,
      email: 'test@example.com',
      role: mockRole,
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

  beforeEach(async () => {
    transactionalRepo = {
      createClient: jest.fn().mockResolvedValue(mockClient),
      findAll: jest.fn(),
      findById: jest.fn().mockResolvedValue(mockClient),
      findByUserId: jest.fn(),
      addCoffeeCoins: jest.fn(),
      update: jest.fn(),
      withTransaction: jest.fn(),
    };

    const mockClientRepository = {
      createClient: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      withTransaction: jest.fn().mockReturnValue(transactionalRepo),
    };

    const mockCreatePeopleUseCase = {
      execute: jest.fn().mockResolvedValue(mockPerson),
    };

    const mockGetRoleByNameUseCase = {
      execute: jest.fn().mockResolvedValue(mockRole),
    };

    const mockCreateCoffeeCoinsUseCase = {
      execute: jest.fn().mockResolvedValue({ id: 1, client: mockClient }),
    };

    const mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {},
    };

    const mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    sendEmailUseCase = {
      execute: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        CreateClientUseCase,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: IClientRepositoryToken,
          useValue: mockClientRepository,
        },
        {
          provide: CreatePeopleUseCase,
          useValue: mockCreatePeopleUseCase,
        },
        {
          provide: GetRoleByNameUseCase,
          useValue: mockGetRoleByNameUseCase,
        },
        {
          provide: SendWelcomeEmailUseCase,
          useValue: sendEmailUseCase,
        },
      ],
    }).compile();

    createClientUseCase =
      moduleFixture.get<CreateClientUseCase>(CreateClientUseCase);
    clientRepository = moduleFixture.get<IClientRepository>(
      IClientRepositoryToken,
    );
    createPeopleUseCase =
      moduleFixture.get<CreatePeopleUseCase>(CreatePeopleUseCase);
    getRoleByNameUseCase =
      moduleFixture.get<GetRoleByNameUseCase>(GetRoleByNameUseCase);
  });

  it('should create a client successfully', async () => {
    const userData = {
      email: 'test@example.com',
      status: true,
    };

    const personData = {
      type_document: 'CC',
      number_document: '123456',
      full_name: 'John Doe',
      phone_number: '3001234567',
    };

    const result = await createClientUseCase.execute({ userData, personData });

    expect(result).toEqual(mockClient);
    expect(getRoleByNameUseCase.execute).toHaveBeenCalledWith(Role.CLIENT);
    expect(createPeopleUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userData: expect.objectContaining({
          email: 'test@example.com',
          role: mockRole,
        }),
        personData,
      }),
    );
    expect(transactionalRepo.createClient).toHaveBeenCalledWith({
      person: mockPerson,
    });
    expect(sendEmailUseCase.execute).toHaveBeenCalledWith(mockClient);
    expect(transactionalRepo.findById).toHaveBeenCalledWith(mockClient.id);
  });

  it('should throw a ConflictException if the client already exists', async () => {
    const userData = {
      email: 'test@example.com',
      status: true,
    };

    const personData = {
      type_document: 'CC',
      number_document: '123456',
      full_name: 'John Doe',
      phone_number: '3001234567',
    };

    (transactionalRepo.createClient as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      createClientUseCase.execute({ userData, personData }),
    ).rejects.toThrow(ConflictException);

    expect(getRoleByNameUseCase.execute).toHaveBeenCalledWith(Role.CLIENT);
    expect(createPeopleUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userData: expect.objectContaining({
          email: 'test@example.com',
          role: mockRole,
        }),
        personData,
      }),
    );
  });

  it('should throw NotFoundException if role is not found', async () => {
    (getRoleByNameUseCase.execute as jest.Mock).mockResolvedValueOnce(null);

    const userData = {
      email: 'test@example.com',
      status: true,
    };

    const personData = {
      type_document: 'CC',
      number_document: '123456',
      full_name: 'John Doe',
      phone_number: '3001234567',
    };

    await expect(
      createClientUseCase.execute({ userData, personData }),
    ).rejects.toThrow(new NotFoundException(`Role ${Role.CLIENT} not found`));

    expect(getRoleByNameUseCase.execute).toHaveBeenCalledWith(Role.CLIENT);
    expect(createPeopleUseCase.execute).not.toHaveBeenCalled();
    expect(transactionalRepo.createClient).not.toHaveBeenCalled();
  });
});
