import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import { BranchesEntity } from 'src/modules/stores/infrastructure/entities/branches.entity';
import { StoreEntity } from 'src/modules/stores/infrastructure/entities/store.entity';
import { AppDataSource } from 'src/config/data-source';

describe('BranchesEntity - Database Model Tests', () => {
  let dataSource: DataSource;
  let branchRepository;
  let storeRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(AppDataSource.options), 
      ],
    }).compile();

    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
    branchRepository = dataSource.getRepository(BranchesEntity);
    storeRepository = dataSource.getRepository(StoreEntity);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    await branchRepository.clear();
    await storeRepository.clear();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });

  test('should have correct schema definition', () => {
    const columns = dataSource.getMetadata(BranchesEntity).columns;
    const columnNames = columns.map((col) => col.propertyName);

    expect(columnNames).toEqual(
      expect.arrayContaining([
        'id',
        'name',
        'phone_number',
        'latitude',
        'longitude',
        'address',
        'average_rating',
        'status',
        'createdAt',
        'updatedAt',
      ]),
    );

    const relations = dataSource.getMetadata(BranchesEntity).relations;
    const relationNames = relations.map((rel) => rel.propertyName);

    expect(relationNames).toEqual(
      expect.arrayContaining(['store', 'administrators', 'employees']),
    );
  });

  test('should create a valid branch', async () => {
    const mockStore = storeRepository.create({
      name: 'Mock Store',
      type_document: 'NIT',
      number_document: '900123456', 
      logo: 'mock-logo.png',
      phone_number: '3011234567',
      email: 'store@example.com',
      status: 'active',
    });

    const savedStore = await storeRepository.save(mockStore);

    const branch = branchRepository.create({
      store: savedStore,
      name: 'Main Branch',
      phone_number: '3001234567',
      latitude: 10.12345,
      longitude: -75.67890,
      address: '123 Main Street',
      average_rating: 4.5,
      status: true,
    });

    const savedBranch = await branchRepository.save(branch);

    expect(savedBranch.id).toBeDefined();
    expect(savedBranch.store).toEqual(savedStore);
    expect(savedBranch.name).toBe('Main Branch');
    expect(savedBranch.phone_number).toBe('3001234567');
    expect(savedBranch.latitude).toBe(10.12345);
    expect(savedBranch.longitude).toBe(-75.67890);
    expect(savedBranch.address).toBe('123 Main Street');
    expect(savedBranch.average_rating).toBe(4.5);
  });

  test('should enforce name uniqueness', async () => {
    const mockStore = storeRepository.create({
      name: 'Mock Store',
      type_document: 'NIT',
      number_document: '900123456',
      logo: 'mock-logo.png',
      phone_number: '3011234567',
      email: 'store@example.com',
      status: 'active',
    });

    const savedStore = await storeRepository.save(mockStore);

    const branch1 = branchRepository.create({
      store: savedStore,
      name: 'Unique Branch',
      phone_number: '3001234567',
      latitude: 10.12345,
      longitude: -75.67890,
      address: '123 Main Street',
      average_rating: 4.5,
      status: true,
    });

    await branchRepository.save(branch1);

    const branch2 = branchRepository.create({
      store: savedStore,
      name: 'Unique Branch', 
      phone_number: '3007654321',
      latitude: 11.12345,
      longitude: -76.67890,
      address: '456 Secondary Street',
      average_rating: 3.2,
      status: true,
    });

    await expect(branchRepository.save(branch2)).rejects.toThrow(QueryFailedError);
  });

  test('should enforce store number_document uniqueness', async () => {
    const store1 = storeRepository.create({
      name: 'Store One',
      type_document: 'NIT',
      number_document: '900123456',
      logo: 'store-logo-1.png',
      phone_number: '3011234567',
      email: 'storeone@example.com',
      status: 'active',
    });

    const store2 = storeRepository.create({
      name: 'Store Two',
      type_document: 'NIT',
      number_document: '900123456',
      logo: 'store-logo-2.png',
      phone_number: '3017654321',
      email: 'storetwo@example.com',
      status: 'active',
    });

    await storeRepository.save(store1);

    await expect(storeRepository.save(store2)).rejects.toThrow(QueryFailedError);
  });
});
