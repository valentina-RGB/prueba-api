import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { AppDataSource } from 'src/config/data-source';
import { StoreEntity } from 'src/modules/stores/infrastructure/entities/store.entity';
import { DataSource, QueryFailedError } from 'typeorm';

describe('StoreEntity - Database Model Tests', () => {
  let dataSource: DataSource;
  let storeRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(AppDataSource.options)],
    }).compile();

    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
    storeRepository = dataSource.getRepository(StoreEntity);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    await storeRepository.clear();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });

  test('should have correct schema definition', () => {
    const columns = dataSource.getMetadata(StoreEntity).columns;
    const columnNames = columns.map((col) => col.propertyName);
    expect(columnNames).toEqual(
      expect.arrayContaining([
        'id',
        'name',
        'type_document',
        'number_document',
        'logo',
        'phone_number',
        'email',
        'status',
        'createdAt',
        'updatedAt',
      ]),
    );
  });

  test('should create a valid store', async () => {
    const store = storeRepository.create({
      name: 'Tienda A',
      type_document: 'NIT',
      number_document: '123456',
      phone_number: '123-456',
      email: 'tienda@correo.com',
    });

    const savedStore = await storeRepository.save(store);

    expect(savedStore.id).toBeDefined();
    expect(savedStore.name).toBe(store.name);
    expect(savedStore.number_document).toBe(store.number_document);
    expect(savedStore.email).toBe(store.email);
  });

  test('should enforce unique number_document constraint', async () => {
    const store1 = storeRepository.create({
      name: 'Tienda A',
      type_document: 'NIT',
      number_document: '123456',
      phone_number: '123-456',
      email: 'tienda@correo.com',
    });

    await storeRepository.save(store1);

    const store2 = storeRepository.create({
      name: 'Tienda A',
      type_document: 'NIT',
      number_document: '123456',
      phone_number: '123-456',
      email: 'tienda@correo.com',
    });

    await expect(storeRepository.save(store2)).rejects.toThrow(
      QueryFailedError,
    );
  });
});
