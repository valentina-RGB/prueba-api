import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import { BranchApprovalEntity } from 'src/modules/stores/infrastructure/entities/branch-approval.entity';
import { BranchesEntity } from 'src/modules/stores/infrastructure/entities/branches.entity';
import { StoreEntity } from 'src/modules/stores/infrastructure/entities/store.entity';
import { AppDataSource } from 'src/config/data-source';
import { AdministratorEntity } from 'src/modules/users/infrastructure/entities/admin.entity';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';

describe('BranchApprovalEntity - Database Model Tests', () => {
  let dataSource: DataSource;
  let approvalRepository;
  let branchRepository;
  let adminRepository;
  let storeRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(AppDataSource.options)],
    }).compile();

    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
    approvalRepository = dataSource.getRepository(BranchApprovalEntity);
    branchRepository = dataSource.getRepository(BranchesEntity);
    adminRepository = dataSource.getRepository(AdministratorEntity);
    storeRepository = dataSource.getRepository(StoreEntity);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    await approvalRepository.query('DELETE FROM criteria_responses');
    await approvalRepository.clear();
    await branchRepository.clear();
    await adminRepository.clear();
    await storeRepository.clear();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });

  test('should have correct schema definition', () => {
    const columns = dataSource.getMetadata(BranchApprovalEntity).columns;
    const columnNames = columns.map((col) => col.propertyName);

    expect(columnNames).toEqual(
      expect.arrayContaining([
        'id',
        'status',
        'comments',
        'approval_date',
        'updatedAt',
      ]),
    );

    const relations = dataSource.getMetadata(BranchApprovalEntity).relations;
    const relationNames = relations.map((rel) => rel.propertyName);

    expect(relationNames).toEqual(
      expect.arrayContaining(['branch', 'approved_by', 'criteria_responses']),
    );
  });

  test('should create a valid approval with default values', async () => {
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
      status: true,
    });

    const approval = approvalRepository.create({
      branch,
      status: 'PENDING',
    });

    const savedApproval = await approvalRepository.save(approval);

    expect(savedApproval.id).toBeDefined();
    expect(savedApproval.status).toBe('PENDING');
    expect(savedApproval.comments).toBeNull();
    expect(savedApproval.approval_date).toBeInstanceOf(Date);
    expect(savedApproval.updatedAt).toBeInstanceOf(Date);
    expect(savedApproval.branch.id).toBe(branch.id);
  });

  test('should require branch relationship', async () => {
    const approval = approvalRepository.create({
      status: 'PENDING',
    });

    await expect(approvalRepository.save(approval)).rejects.toThrow(
      QueryFailedError,
    );
  });
});
