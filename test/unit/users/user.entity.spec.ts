import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../../../src/config/data-source';
import { UserEntity } from '../../../src/modules/users/infrastructure/entities/user.entity';
import { RoleEntity } from 'src/modules/users/infrastructure/entities/role.entity';

describe('UserEntity - Database Model Tests', () => {
  let dataSource: DataSource;
  let userRepository;
  let roleRepository;

  const mockRole = {
    id: 1,
    name: 'Admin',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(AppDataSource.options)],
    }).compile();

    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
    userRepository = dataSource.getRepository(UserEntity);
    roleRepository = dataSource.getRepository(RoleEntity);
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });

  test('should have correct schema definition', () => {
    const columns = dataSource.getMetadata(UserEntity).columns;
    const columnNames = columns.map((col) => col.propertyName);
    expect(columnNames).toEqual(
      expect.arrayContaining([
        'id',
        'email',
        'password',
        'role',
        'status',
        'createdAt',
        'updatedAt',
      ]),
    );
  });

  test('should create a valid user', async () => {
    const role = roleRepository.create(mockRole);
    await roleRepository.save(role);

    const user = userRepository.create({
      email: 'john@example.com',
      password: 'password123',
      role,
    });

    const savedUser = await userRepository.save(user);
    expect(savedUser.id).toBeDefined();
    expect(savedUser.email).toBe(user.email);
  });

  test('should enforce unique email constraint', async () => {
    const user1 = userRepository.create({
      role: mockRole,
      email: 'john@example.com',
      password: 'password123',
    });
    await userRepository.save(user1);

    const user2 = userRepository.create({
      role: mockRole,
      email: 'john@example.com',
      password: 'password123',
    });
    await expect(userRepository.save(user2)).rejects.toThrow();
  });

  test('should enforce required fields', async () => {
    const invalidUser = userRepository.create({
      password: 'password123',
    });

    await expect(userRepository.save(invalidUser)).rejects.toThrow();
  });
});
