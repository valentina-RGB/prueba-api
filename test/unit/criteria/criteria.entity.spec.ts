import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { AppDataSource } from 'src/config/data-source';
import { CriteriaEntity } from 'src/modules/stores/infrastructure/entities/criteria.entity';
import { DataSource, QueryFailedError } from 'typeorm';

describe('CriteriaEntity - Database Model Tests', () => {
  let dataSource: DataSource;
  let criteriaRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(AppDataSource.options)],
    }).compile();

    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
    criteriaRepository = dataSource.getRepository(CriteriaEntity);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    await criteriaRepository.clear();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });

  test('should have correct schema definition', () => {
    const columns = dataSource.getMetadata(CriteriaEntity).columns;
    const columnNames = columns.map((col) => col.propertyName);
    expect(columnNames).toEqual(
      expect.arrayContaining([
        'id',
        'name',
        'description',
        'active',
        'requires_image',
        'createdAt',
        'updatedAt',
      ]),
    );
  });

  test('should create a valid criteria', async () => {
    const criteria = criteriaRepository.create({
      name: 'Nuevo Criterio',
      description: 'Descripción del criterio',
      active: true,
      requires_image: false,
    });

    const savedCriteria = await criteriaRepository.save(criteria);
    expect(savedCriteria.id).toBeDefined();
    expect(savedCriteria.name).toBe(criteria.name);
    expect(savedCriteria.description).toBe(criteria.description);
  });

//   test('should enforce unique name constraint', async () => {
//     const criteria1 = criteriaRepository.create({
//       name: 'Criterio Único',
//       description: 'Descripción del primer criterio',
//     });

//     await criteriaRepository.save(criteria1);

//     const criteria2 = criteriaRepository.create({
//       name: 'Criterio Único',
//       description: 'Descripción del segundo criterio',
//     });

//     await expect(criteriaRepository.save(criteria2)).rejects.toThrow(QueryFailedError);
//   });
});
