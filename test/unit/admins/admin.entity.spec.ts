import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { AppDataSource } from 'src/config/data-source';
import { AdministratorEntity } from 'src/modules/users/infrastructure/entities/admin.entity';
import { PeopleEntity } from 'src/modules/users/infrastructure/entities/people.entity';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/modules/users/infrastructure/entities/user.entity';
import { RoleEntity } from 'src/modules/users/infrastructure/entities/role.entity';

describe('AdminEntity - Database Model Tests', () => {
  let dataSource: DataSource;
  let adminRepository;
  let personRepository;
  let userRepository;
  let roleRepository;

  const mockRole = {
    id: 1,
    name: 'Admin',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    email: 'john@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(AppDataSource.options)],
    }).compile();

    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
    adminRepository = dataSource.getRepository(AdministratorEntity);
    personRepository = dataSource.getRepository(PeopleEntity);
    roleRepository = dataSource.getRepository(RoleEntity);
    userRepository = dataSource.getRepository(UserEntity);
  });

  beforeEach(async () => {
    await adminRepository.clear();
    await personRepository.clear();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });

  test('should have correct schema definition', () => {
    const columns = dataSource.getMetadata(AdministratorEntity).columns;
    const columnNames = columns.map((col) => col.propertyName);
    expect(columnNames).toEqual(
      expect.arrayContaining([
        'id',
        'person',
        'admin_type',
        'entity_id',
        'createdAt',
        'updatedAt',
      ]),
    );
  });

  test('should create a valid admin', async () => {
    const role = roleRepository.create(mockRole);
    await roleRepository.save(role);

    const user = userRepository.create({ ...mockUser, role });
    await userRepository.save(user);

    const person = personRepository.create({
      user,
      type_document: 'CC',
      number_document: '123456',
      full_name: 'John Doe',
      phone_number: '3001234567',
    });

    const savedPerson = await personRepository.save(person);

    const admin = adminRepository.create({
      person: savedPerson,
      admin_type: 'SYSTEM',
      entity_id: null,
    });
    const savedAdmin = await adminRepository.save(admin);
    expect(savedAdmin.id).toBeDefined();
    expect(savedAdmin.admin_type).toBe(admin.admin_type);
    expect(savedAdmin.entity_id).toBe(admin.entity_id);
  });

  test('should enforce foreign key constraint on person', async () => {
    const admin = adminRepository.create({
      person: { id: 999 },
      admin_type: 'SYSTEM',
      entity_id: null,
    });
    await expect(adminRepository.save(admin)).rejects.toThrow();
  });
});
