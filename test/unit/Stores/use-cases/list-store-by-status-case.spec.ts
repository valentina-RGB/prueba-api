import { Test, TestingModule } from '@nestjs/testing';
import { ListStoreByStatusUseCase } from 'src/modules/stores/application/use-cases/stores/list-store-by-status.use-case';
import { IStoreRepositoryToken } from 'src/modules/stores/domain/repositories/store.repository.interface';
import { IStore } from 'src/modules/stores/domain/models/store.interface';

describe('ListStoreByStatusUseCase', () => {
  let useCase: ListStoreByStatusUseCase;
  let storeRepository: { findByStatus: jest.Mock };

  beforeEach(async () => {
    storeRepository = {
      findByStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListStoreByStatusUseCase,
        { provide: IStoreRepositoryToken, useValue: storeRepository },
      ],
    }).compile();

    useCase = module.get<ListStoreByStatusUseCase>(ListStoreByStatusUseCase);
  });

  it('should return a list of stores by status', async () => {
    const status = 'approved';

    const mockStores: IStore[] = [
      {
        id: 1,
        name: 'Tienda 1',
        type_document: 'NIT',
        number_document: '123456789',
        phone_number: '3001234567',
        email: 'tienda1@example.com',
        status,
        logo: 'logo1.png',
      },
      {
        id: 2,
        name: 'Tienda 2',
        type_document: 'CC',
        number_document: '987654321',
        phone_number: '3109876543',
        email: 'tienda2@example.com',
        status,
        logo: 'logo2.png',
      },
    ];

    storeRepository.findByStatus.mockResolvedValue(mockStores);

    const result = await useCase.execute(status);

    expect(storeRepository.findByStatus).toHaveBeenCalledWith(status);
    expect(result).toEqual(mockStores);
  });
});
