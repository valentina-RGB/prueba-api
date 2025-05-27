import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import { ClientEntity } from 'src/modules/users/infrastructure/entities/client.entity';
import { PeopleEntity } from 'src/modules/users/infrastructure/entities/people.entity';
import { AppDataSource } from 'src/config/data-source';
import { UserEntity } from 'src/modules/users/infrastructure/entities/user.entity';
import { RoleEntity } from 'src/modules/users/infrastructure/entities/role.entity';

describe('ClientEntity - Database Model Tests', () => {
  let dataSource: DataSource;
  let clientRepository;
  let peopleRepository;
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
    clientRepository = dataSource.getRepository(ClientEntity);
    peopleRepository = dataSource.getRepository(PeopleEntity);
    roleRepository = dataSource.getRepository(RoleEntity);
    userRepository = dataSource.getRepository(UserEntity);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    await clientRepository.clear();
    await peopleRepository.clear();
    await userRepository.clear();
    await roleRepository.clear();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });

  test('should have correct schema definition', () => {
    const columns = dataSource.getMetadata(ClientEntity).columns;
    const columnNames = columns.map((col) => col.propertyName);

    expect(columnNames).toEqual(
      expect.arrayContaining(['id', 'person', 'createdAt', 'updatedAt']),
    );
  });

  test('should create a valid client', async () => {
    const role = roleRepository.create(mockRole);
    await roleRepository.save(role);

    const user = userRepository.create({ ...mockUser, role });
    await userRepository.save(user);

    const mockPerson = peopleRepository.create({
      user,
      type_document: 'CC',
      number_document: '123456',
      full_name: 'John Doe',
      phone_number: '3001234567',
    });

    const savedPerson = await peopleRepository.save(mockPerson);

    const client = clientRepository.create({
      person: savedPerson,
    });

    const savedClient = await clientRepository.save(client);

    expect(savedClient.id).toBeDefined();
    expect(savedClient.person).toEqual(savedPerson);
  });

  test('should enforce person uniqueness', async () => {
    const role = roleRepository.create(mockRole);
    await roleRepository.save(role);

    const user = userRepository.create({ ...mockUser, role });
    await userRepository.save(user);

    const mockPerson = peopleRepository.create({
      user,
      type_document: 'CC',
      number_document: '123456',
      full_name: 'John Doe',
      phone_number: '3001234567',
    });

    const savedPerson = await peopleRepository.save(mockPerson);

    const client1 = clientRepository.create({
      person: savedPerson,
    });

    await clientRepository.save(client1);

    const client2 = clientRepository.create({
      person: savedPerson,
    });

    await expect(clientRepository.save(client2)).rejects.toThrow(
      QueryFailedError,
    );
  });
});
