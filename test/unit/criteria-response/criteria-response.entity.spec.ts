import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from 'src/config/data-source';
import { BranchApprovalEntity } from 'src/modules/stores/infrastructure/entities/branch-approval.entity';
import { CriteriaResponseEntity } from 'src/modules/stores/infrastructure/entities/criteria-response.entity';
import { CriteriaEntity } from 'src/modules/stores/infrastructure/entities/criteria.entity';
import { BranchesEntity } from 'src/modules/stores/infrastructure/entities/branches.entity';
import { StoreEntity } from 'src/modules/stores/infrastructure/entities/store.entity';

describe('CriteriaResponseEntity - Database Model Tests', () => {
  let dataSource: DataSource;
  let responseRepository;
  let criteriaRepository;
  let approvalRepository;
  let branchRepository;
  let storeRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(AppDataSource.options)],
    }).compile();

    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
    responseRepository = dataSource.getRepository(CriteriaResponseEntity);
    criteriaRepository = dataSource.getRepository(CriteriaEntity);
    approvalRepository = dataSource.getRepository(BranchApprovalEntity);
    branchRepository = dataSource.getRepository(BranchesEntity);
    storeRepository = dataSource.getRepository(StoreEntity);
  });

  beforeEach(async () => {
    await responseRepository.clear();
    await criteriaRepository.clear();
    await approvalRepository.clear();
    await branchRepository.clear();
    await storeRepository.clear();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });

  test('should have correct schema definition', () => {
    const columns = dataSource.getMetadata(CriteriaResponseEntity).columns;
    const columnNames = columns.map((col) => col.propertyName);
    expect(columnNames).toEqual(
      expect.arrayContaining([
        'id',
        'response_text',
        'image_url',
        'status',
        'createdAt',
        'updatedAt',
      ]),
    );
  });

  test('should create a valid CriteriaResponseEntity', async () => {
    const store = await storeRepository.save({
      name: 'Mock Store',
      type_document: 'NIT',
      number_document: '900123456',
      logo: 'mock-logo.png',
      phone_number: '3011234567',
      email: 'store@example.com',
      status: 'APPROVED',
    });

    const branch = await branchRepository.save({
      store,
      name: 'Main Branch',
      phone_number: '3001234567',
      latitude: 10.12345,
      longitude: -75.6789,
      address: '123 Main Street',
      average_rating: 4.5,
      status: 'APPROVED',
    });

    const mockCriteria = {
      name: 'Limpieza general',
      description: 'Verificar limpieza de las áreas comunes',
      active: true,
      requires_image: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockApproval = {
      branch,
      status: 'PENDING',
      updatedAt: new Date(),
    };

    const criteria = await criteriaRepository.save(
      criteriaRepository.create(mockCriteria),
    );
    const approval = await approvalRepository.save(
      approvalRepository.create(mockApproval),
    );

    const response = responseRepository.create({
      response_text: 'Todo limpio',
      image_url: 'http://img.com/clean.jpg',
      status: true,
      criteria,
      approval,
    });

    const saved = await responseRepository.save(response);

    expect(saved.id).toBeDefined();
    expect(saved.response_text).toBe('Todo limpio');
    expect(saved.status).toBe(true);
    expect(saved.criteria.id).toBe(criteria.id);
    expect(saved.approval.id).toBe(approval.id);
  });

  test('should not save without criteria or approval', async () => {
    const response = responseRepository.create({
      response_text: 'Sin criterio',
      status: false,
    });

    await expect(responseRepository.save(response)).rejects.toThrow();
  });
});
