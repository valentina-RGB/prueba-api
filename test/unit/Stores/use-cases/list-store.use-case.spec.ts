import { Test, TestingModule } from '@nestjs/testing';
import { ListStoreUseCase } from 'src/modules/stores/application/use-cases/stores/list-store.use.case';
import { IStoreRepositoryToken } from 'src/modules/stores/domain/repositories/store.repository.interface';
import { IStore } from 'src/modules/stores/domain/models/store.interface';

describe('ListStoreUseCase', () => {
  let listStoreUseCase: ListStoreUseCase;
  let storeRepository: { findAll: jest.Mock };

  beforeEach(async () => {
    storeRepository = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListStoreUseCase,
        { provide: IStoreRepositoryToken, useValue: storeRepository },
      ],
    }).compile();

    listStoreUseCase = module.get<ListStoreUseCase>(ListStoreUseCase);
  });

  it('should return a list of stores', async () => {
    const stores: IStore[] = [
      {
        id: 1,
        name: 'Tienda A',
        type_document: 'NIT',
        number_document: '123456',
        phone_number: '123456789',
        email: 'tiendaA@example.com',
        status: 'pending',
        logo: 'logo-a.png',
      },
      {
        id: 2,
        name: 'Tienda B',
        type_document: 'CC',
        number_document: '654321',
        phone_number: '987654321',
        email: 'tiendaB@example.com',
        status: 'approved',
        logo: 'logo-b.png',
      },
    ];

    storeRepository.findAll.mockResolvedValue(stores);

    const result = await listStoreUseCase.execute();

    expect(result).toEqual(stores);
    expect(storeRepository.findAll).toHaveBeenCalled();
  });
});
