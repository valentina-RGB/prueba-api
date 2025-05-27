import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetStoreUseCase } from 'src/modules/stores/application/use-cases/stores/get-store.use-case';
import {
  IAdminRepository,
  IAdminRepositoryToken,
} from 'src/modules/users/domain/repositories/admin.repository.interface';
import { RegisterStoreAdminUseCase } from 'src/modules/users/application/use-cases/admins/create-store-admin.use-case';
import { CreatePeopleUseCase } from 'src/modules/users/application/use-cases/people/create-people.use-case';
import { GetRoleByNameUseCase } from 'src/modules/users/application/use-cases/roles/get-role-by-name.use-case';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { DataSource } from 'typeorm';

describe('RegisterStoreAdminUseCase', () => {
  let registerStoreAdminUseCase: RegisterStoreAdminUseCase;
  let getStoreUseCase: jest.Mocked<GetStoreUseCase>;
  let createPeopleUseCase: jest.Mocked<CreatePeopleUseCase>;
  let getRoleByNameUseCase: jest.Mocked<GetRoleByNameUseCase>;
  let adminRepository: jest.Mocked<IAdminRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterStoreAdminUseCase,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              manager: {},
            }),
          },
        },
        {
          provide: GetStoreUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreatePeopleUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetRoleByNameUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: IAdminRepositoryToken,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            withTransaction: jest.fn().mockReturnThis(), // importante
          },
        },
      ],
    }).compile();
  
    registerStoreAdminUseCase = moduleRef.get(RegisterStoreAdminUseCase);
    getStoreUseCase = moduleRef.get(GetStoreUseCase) as jest.Mocked<GetStoreUseCase>;
    createPeopleUseCase = moduleRef.get(CreatePeopleUseCase) as jest.Mocked<CreatePeopleUseCase>;
    getRoleByNameUseCase = moduleRef.get(GetRoleByNameUseCase) as jest.Mocked<GetRoleByNameUseCase>;
    adminRepository = moduleRef.get(IAdminRepositoryToken) as jest.Mocked<IAdminRepository>;
  });  

  it('should register a store admin successfully', async () => {
    const store = {
      id: 1,
      name: 'Las Desdichas del Café',
      type_document: 'NIT',
      number_document: '765455559-3',
      logo: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
      phone_number: '3114567890',
      email: 'valensc2545@gmail.com',
      status: 'APPROVED',
    };
    const role = { id: 1, name: Role.ADMIN_STORE, status: true };
    const person = {
      id: 1,
      user: {
        id: 1,
        email: 'test@example.com',
        role: role,
        status: true,
      },
      type_document: 'CC',
      number_document: '123456',
      full_name: 'John Doe',
      phone_number: '3001234567',
    };
    const admin = {
      id: 1,
      person_id: person.id,
      admin_type: 'STORE',
      entity_id: store.id,
    };

    getStoreUseCase.execute.mockResolvedValue(store);
    getRoleByNameUseCase.execute.mockResolvedValue(role);
    createPeopleUseCase.execute.mockResolvedValue(person);
    adminRepository.create.mockResolvedValue(admin);
    adminRepository.findById.mockResolvedValue(admin);

    const result = await registerStoreAdminUseCase.execute({
      storeData: { id: 1 },
      userData: { email: 'test@example.com' },
      personData: { full_name: 'John Doe' },
    });

    expect(result).toEqual(admin);
  });

  it('should throw BadRequestException if store does not exist', async () => {
    getStoreUseCase.execute.mockResolvedValue(null);

    await expect(
      registerStoreAdminUseCase.execute({
        storeData: { id: 99 },
        userData: {},
        personData: {},
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if role is not found', async () => {
    const store = {
      id: 1,
      name: 'Las Desdichas del Café',
      type_document: 'NIT',
      number_document: '765455559-3',
      logo: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
      phone_number: '3114567890',
      email: 'valensc2545@gmail.com',
      status: 'APPROVED',
    };

    getStoreUseCase.execute.mockResolvedValue(store);
    getRoleByNameUseCase.execute.mockResolvedValue(null);

    await expect(
      registerStoreAdminUseCase.execute({
        storeData: { id: 1 },
        userData: {},
        personData: {},
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
