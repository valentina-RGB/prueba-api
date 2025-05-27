import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import { AppDataSource } from 'src/config/data-source';
import { SocialBranchEntity } from 'src/modules/stores/infrastructure/entities/social-branch.entity';
import { BranchesEntity } from 'src/modules/stores/infrastructure/entities/branches.entity';
import { SocialNetworkEntity } from 'src/modules/stores/infrastructure/entities/social-network.entity';
import { StoreEntity } from 'src/modules/stores/infrastructure/entities/store.entity';

describe('SocialBranchEntity - Database Model Tests', () => {
  let dataSource: DataSource;
  let socialBranchRepository;
  let branchRepository;
  let socialNetworkRepository;
  let storeRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(AppDataSource.options)],
    }).compile();

    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
    socialBranchRepository = dataSource.getRepository(SocialBranchEntity);
    branchRepository = dataSource.getRepository(BranchesEntity);
    socialNetworkRepository = dataSource.getRepository(SocialNetworkEntity);
    storeRepository = dataSource.getRepository(StoreEntity);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    await socialBranchRepository.clear();
    await branchRepository.clear();
    await socialNetworkRepository.clear();
    await storeRepository.clear();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });

  async function createTestData() {
    const store = storeRepository.create({
      name: 'Test Store',
      type_document: 'NIT',
      number_document: '123456789',
      logo: 'logo.png',
      phone_number: '3001234567',
      email: 'store@test.com',
      status: 'ACTIVE'
    });
    const savedStore = await storeRepository.save(store);

    const branch = branchRepository.create({
      name: 'Test Branch',
      phone_number: '3001234567',
      latitude: 10.123,
      longitude: -75.456,
      address: 'Test Address',
      store: savedStore
    });
    const savedBranch = await branchRepository.save(branch);

    const socialNetwork = socialNetworkRepository.create({
      name: 'Facebook'
    });
    const savedSocialNetwork = await socialNetworkRepository.save(socialNetwork);

    return { savedStore, savedBranch, savedSocialNetwork };
  }

  test('should have correct schema definition', () => {
    const metadata = dataSource.getMetadata(SocialBranchEntity);
    
    const columnNames = metadata.columns.map(col => col.propertyName);
    expect(columnNames).toEqual(
      expect.arrayContaining(['id', 'description', 'value', 'createdAt', 'updatedAt'])
    );
    
    expect(metadata.relations.length).toBe(2);
    expect(metadata.relations.some(r => r.propertyName === 'branch')).toBeTruthy();
    expect(metadata.relations.some(r => r.propertyName === 'social_network')).toBeTruthy();
  });

  test('should create a valid social branch with required fields', async () => {
    const { savedBranch, savedSocialNetwork } = await createTestData();

    const socialBranch = socialBranchRepository.create({
      description: 'Official Page',
      value: 'https://facebook.com/test',
      branch: savedBranch,
      social_network: savedSocialNetwork
    });

    const savedSocialBranch = await socialBranchRepository.save(socialBranch);

    expect(savedSocialBranch.id).toBeDefined();
    expect(savedSocialBranch.description).toBe('Official Page');
    expect(savedSocialBranch.value).toBe('https://facebook.com/test');
    expect(savedSocialBranch.branch.id).toBe(savedBranch.id);
    expect(savedSocialBranch.social_network.id).toBe(savedSocialNetwork.id);
  });

  test('should validate required fields', async () => {
    const socialBranch = socialBranchRepository.create({});
    
    await expect(socialBranchRepository.save(socialBranch)).rejects.toThrow(
      QueryFailedError
    );
  });

  test('should maintain relationships correctly', async () => {
    const { savedBranch, savedSocialNetwork } = await createTestData();

    const socialBranch = socialBranchRepository.create({
      description: 'Profile',
      value: 'https://instagram.com/test',
      branch: savedBranch,
      social_network: savedSocialNetwork
    });
    const savedSocialBranch = await socialBranchRepository.save(socialBranch);

    const refreshedBranch = await branchRepository.findOne({
      where: { id: savedBranch.id },
      relations: ['social_branches']
    });
    expect(refreshedBranch.social_branches.length).toBe(1);
    expect(refreshedBranch.social_branches[0].id).toBe(savedSocialBranch.id);

    const refreshedSocialNetwork = await socialNetworkRepository.findOne({
      where: { id: savedSocialNetwork.id },
      relations: ['social_branches']
    });
    expect(refreshedSocialNetwork.social_branches.length).toBe(1);
    expect(refreshedSocialNetwork.social_branches[0].id).toBe(savedSocialBranch.id);
  });
});