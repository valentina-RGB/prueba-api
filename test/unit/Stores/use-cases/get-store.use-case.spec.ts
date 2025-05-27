import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetStoreUseCase } from 'src/modules/stores/application/use-cases/stores/get-store.use-case';
import {
  IStoreRepository,
  IStoreRepositoryToken,
} from 'src/modules/stores/domain/repositories/store.repository.interface';
import { IStore } from 'src/modules/stores/domain/models/store.interface';
describe('GetStoreByIdUseCase', () => {
  let getStoreUseCase: GetStoreUseCase;
  let storeRepository: IStoreRepository;

  beforeEach(async () => {
    const mockStoreRepository = {
      findById: jest.fn(),
    };

    const moduleFixture = await Test.createTestingModule({
      providers: [
        GetStoreUseCase,
        {
          provide: IStoreRepositoryToken,
          useValue: mockStoreRepository,
        },
      ],
    }).compile();

    getStoreUseCase = moduleFixture.get<GetStoreUseCase>(GetStoreUseCase);
    storeRepository = moduleFixture.get<IStoreRepository>(
      IStoreRepositoryToken,
    );
  });

  it('should get a store by ID', async () => {
    const store: IStore = {
      id: 1,
      name: 'Main Street Store',
      type_document: 'NIT',
      number_document: '1234567890',
      logo: 'https://example.com/logo.png',
      phone_number: '3001234567',
      email: 'store@example.com',
      status: 'active',
    };

    jest.spyOn(storeRepository, 'findById').mockResolvedValue(store);

    const result = await getStoreUseCase.execute(1);

    expect(result).toEqual(store);
    expect(storeRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw an error if the store does not exist', async () => {
    jest.spyOn(storeRepository, 'findById').mockResolvedValue(null);

    await expect(getStoreUseCase.execute(999)).rejects.toThrow(
      new NotFoundException('Store not found'),
    );
  });
});
