import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { AppDataSource } from 'src/config/data-source';
import { PeopleEntity } from 'src/modules/users/infrastructure/entities/people.entity';
import { RoleEntity } from 'src/modules/users/infrastructure/entities/role.entity';
import { UserEntity } from 'src/modules/users/infrastructure/entities/user.entity';
import { DataSource, QueryFailedError } from 'typeorm';

describe('PeopleEntity - Database Model Tests', () => {
  let dataSource: DataSource;
  let userRepository;
  let roleRepository;
  let peopleRepository;

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

  const mockUser2 = {
    role: mockRole,
    email: 'jane@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(AppDataSource.options)],
    }).compile();

    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
    peopleRepository = dataSource.getRepository(PeopleEntity);
    roleRepository = dataSource.getRepository(RoleEntity);
    userRepository = dataSource.getRepository(UserEntity);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    await peopleRepository.clear();
    await userRepository.clear();
    await roleRepository.clear();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });

  test('should have correct schema definition', () => {
    const columns = dataSource.getMetadata(PeopleEntity).columns;
    const columnNames = columns.map((col) => col.propertyName);
    expect(columnNames).toEqual(
      expect.arrayContaining([
        'id',
        'user',
        'type_document',
        'number_document',
        'full_name',
        'phone_number',
        'createdAt',
        'updatedAt',
      ]),
    );
  });

  test('should create a valid person', async () => {
    const role = roleRepository.create(mockRole);
    await roleRepository.save(role);

    const user = userRepository.create({ ...mockUser, role });
    await userRepository.save(user);

    const person = peopleRepository.create({
      user: user,
      type_document: 'CC',
      number_document: '123456',
      full_name: 'John Doe',
      phone_number: '3001234567',
    });

    const savedPerson = await peopleRepository.save(person);
    expect(savedPerson.id).toBeDefined();
    expect(savedPerson.type_document).toBe(person.type_document);
    expect(savedPerson.number_document).toBe(person.number_document);
    expect(savedPerson.full_name).toBe(person.full_name);
    expect(savedPerson.phone_number).toBe(person.phone_number);
  });

  test('should enforce unique number_document constraint', async () => {
    const role = roleRepository.create(mockRole);
    await roleRepository.save(role);

    const user = userRepository.create({ ...mockUser, role });
    await userRepository.save(user);

    const user2 = userRepository.create({ ...mockUser2, role });
    await userRepository.save(user2);

    const person1 = peopleRepository.create({
      user: user,
      type_document: 'CC',
      number_document: '123456',
      full_name: 'John Doe',
      phone_number: '3001234567',
    });

    await peopleRepository.save(person1);

    const person2 = peopleRepository.create({
      user: user2,
      type_document: 'CC',
      number_document: '123456',
      full_name: 'Jane Doe',
      phone_number: '3007654321',
    });

    await expect(peopleRepository.save(person2)).rejects.toThrow(
      QueryFailedError,
    );
  });
});
