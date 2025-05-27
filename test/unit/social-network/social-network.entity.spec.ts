import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { AppDataSource } from 'src/config/data-source';
import { SocialNetworkEntity } from 'src/modules/stores/infrastructure/entities/social-network.entity';
import { DataSource, QueryFailedError } from 'typeorm';

describe('SocialNetworkEntity - Database Model Tests', () => {
  let dataSource: DataSource;
  let socialNetworkRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(AppDataSource.options)],
    }).compile();

    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
    socialNetworkRepository = dataSource.getRepository(SocialNetworkEntity);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    await socialNetworkRepository.clear();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });

  test('should have correct schema definition', () => {
    const metadata = dataSource.getMetadata(SocialNetworkEntity);

    const columnNames = metadata.columns.map((col) => col.propertyName);
    expect(columnNames).toEqual(['id', 'name', "createdAt", "updatedAt",]);

    const idColumn = metadata.columns.find((col) => col.propertyName === 'id');
    expect(idColumn).toBeDefined();

    if (!idColumn) throw new Error('id column not found');

    expect(idColumn.isPrimary).toBeTruthy();
    expect(idColumn.isGenerated).toBeTruthy();

    const nameColumn = metadata.columns.find(
      (col) => col.propertyName === 'name',
    );
    expect(nameColumn).toBeDefined();

    if (!nameColumn) throw new Error('name column not found');

    expect(Number(nameColumn.length)).toBe(50);

    const isUnique = metadata.uniques.some((unique) =>
      unique.columns.some((col) => col.propertyName === 'name'),
    );
    expect(isUnique).toBe(true);
    const hasUniqueConstraint = metadata.uniques.some((unique) =>
      unique.columns.includes(nameColumn),
    );
    expect(hasUniqueConstraint).toBe(true);
  });

  test('should create a valid social network with just name', async () => {
    const socialNetwork = socialNetworkRepository.create({
      name: 'Facebook',
    });

    const savedSocialNetwork =
      await socialNetworkRepository.save(socialNetwork);

    expect(savedSocialNetwork).toBeDefined();
    expect(savedSocialNetwork.id).toBeDefined();
    expect(savedSocialNetwork.name).toBe('Facebook');
    expect(savedSocialNetwork.createdAt).toBeInstanceOf(Date);
    expect(savedSocialNetwork.updatedAt).toBeInstanceOf(Date);
  });

  test('should enforce unique name constraint', async () => {
    const socialNetwork1 = socialNetworkRepository.create({
      name: 'Instagram',
    });
    await socialNetworkRepository.save(socialNetwork1);

    const socialNetwork2 = socialNetworkRepository.create({
      name: 'Instagram',
    });

    await expect(socialNetworkRepository.save(socialNetwork2)).rejects.toThrow(
      QueryFailedError,
    );
  });

  test('should validate name is not null', async () => {
    const socialNetwork = socialNetworkRepository.create({
      name: null,
    });

    await expect(socialNetworkRepository.save(socialNetwork)).rejects.toThrow(
      QueryFailedError,
    );
  });
});
