import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateStoreUseCase } from 'src/modules/stores/application/use-cases/stores/create-store.use-case';
import { IStoreRepositoryToken } from 'src/modules/stores/domain/repositories/store.repository.interface';
import { CreateStoreDto } from 'src/modules/stores/application/dto/stores/create-store.dto';
import { IStore } from 'src/modules/stores/domain/models/store.interface';
import { ListStoreUseCase } from 'src/modules/stores/application/use-cases/stores/list-store.use.case';

describe('CreateStoreUseCase', () => {
  let createStoreUseCase: CreateStoreUseCase;
  let storeRepository: {
    create: jest.Mock;
    findAll: jest.Mock;
    find: jest.Mock;
  };
  let listStoreUseCase: { execute: jest.Mock };

  beforeEach(async () => {
    storeRepository = {
      find: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };

    listStoreUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateStoreUseCase,
        { provide: IStoreRepositoryToken, useValue: storeRepository },
        { provide: ListStoreUseCase, useValue: listStoreUseCase },
      ],
    }).compile();

    createStoreUseCase = module.get<CreateStoreUseCase>(CreateStoreUseCase);
  });

  it('should create a store', async () => {
    const mockStore: IStore = {
      id: 1,
      name: 'Tienda A',
      type_document: 'NIT',
      number_document: '123456',
      logo: 'logo.png',
      phone_number: '123-456',
      email: 'tienda@correo.com',
      status: 'pending',
    };

    const createDto: CreateStoreDto = {
      name: 'Tienda A',
      type_document: 'NIT',
      number_document: '123456',
      phone_number: '123-456',
      email: 'tienda@correo.com',
      logo: 'logo.png',
    };

    listStoreUseCase.execute.mockResolvedValue([]);
    storeRepository.create.mockResolvedValue(mockStore);

    const result = await createStoreUseCase.execute(createDto);

    expect(result).toEqual(mockStore);
    expect(storeRepository.create).toHaveBeenCalledWith(createDto);
  });

  it('should throw ConflictException if store already exists', async () => {
    const createDto: CreateStoreDto = {
      name: 'Tienda A',
      type_document: 'NIT',
      number_document: '123456',
      phone_number: '123-456',
      email: 'tienda@correo.com',
    };

    listStoreUseCase.execute.mockResolvedValue([
      {
        name: 'Tienda A',
        type_document: 'NIT',
        number_document: '123456',
        phone_number: '123-456',
        email: 'tienda@correo.com',
      },
    ]);

    await expect(createStoreUseCase.execute(createDto)).rejects.toThrow(
      ConflictException,
    );
  });
});
