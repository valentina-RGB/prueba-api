import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { StoreEntity } from '../../../src/modules/stores/infrastructure/entities/store.entity';
import { StoreRepository } from '../../../src/modules/stores/infrastructure/repositories/store.repository';
import { IStore } from '../../../src/modules/stores/domain/models/store.interface';

describe('StoreRepository', () => {
  let repository: StoreRepository;
  let ormRepo: Repository<StoreEntity>;

  const mockStore: IStore = {
    id: 1,
    name: 'Tienda Ejemplo',
    email: 'tienda@example.com',
    status: 'PENDING',
    type_document: 'NIT',
    number_document: '1234567890',
    phone_number: '3012345678',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreRepository,
        {
          provide: getRepositoryToken(StoreEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<StoreRepository>(StoreRepository);
    ormRepo = module.get<Repository<StoreEntity>>(getRepositoryToken(StoreEntity));
  });

  it('should create a store', async () => {
    jest.spyOn(ormRepo, 'save').mockResolvedValue(mockStore as StoreEntity);

    const result = await repository.create(mockStore);
    expect(result).toEqual(mockStore);
  });

  it('should find a store by ID', async () => {
    jest.spyOn(ormRepo, 'findOne').mockResolvedValue(mockStore as StoreEntity);

    const result = await repository.findById(1);
    expect(result).toEqual(mockStore);
  });

  it('should return null if store is not found', async () => {
    jest.spyOn(ormRepo, 'findOne').mockResolvedValue(null);

    const result = await repository.findById(999);
    expect(result).toBeNull();
  });

  it('should find all stores', async () => {
    jest.spyOn(ormRepo, 'find').mockResolvedValue([mockStore] as StoreEntity[]);

    const result = await repository.findAll();
    expect(result).toEqual([mockStore]);
  });

  it('should find stores by status', async () => {
    jest.spyOn(ormRepo, 'find').mockResolvedValue([mockStore] as StoreEntity[]);

    const result = await repository.findByStatus('PENDING');
    expect(result).toEqual([mockStore]);
  });

  it('should update a store', async () => {
    jest.spyOn(ormRepo, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);
    jest.spyOn(ormRepo, 'findOne').mockResolvedValue({
      ...mockStore,
      status: 'APPROVED',
    } as StoreEntity);

    const updatedStore = await repository.update(1, { ...mockStore, status: 'APPROVED' });
    expect(updatedStore.status).toBe('APPROVED');
  });

  it('should throw if store not found after update', async () => {
    jest.spyOn(ormRepo, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);
    jest.spyOn(ormRepo, 'findOne').mockResolvedValue(null);

    await expect(repository.update(1, mockStore)).rejects.toThrow('Store not found after update');
  });
});
