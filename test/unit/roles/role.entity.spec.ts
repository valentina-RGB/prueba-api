  import { TestingModule, Test } from '@nestjs/testing';
  import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
  import { AppDataSource } from 'src/config/data-source';
  import { RoleEntity } from 'src/modules/users/infrastructure/entities/role.entity';
  import { DataSource, QueryFailedError } from 'typeorm';

  describe('RoleEnity - Database Model Tests', () => {
    let dataSource: DataSource;
    let roleRepository;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [TypeOrmModule.forRoot(AppDataSource.options)],
      }).compile();

      dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
      roleRepository = dataSource.getRepository(RoleEntity);

      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    beforeEach(async () => {
      await roleRepository.clear();
    });

    afterAll(async () => {
      if (dataSource.isInitialized) await dataSource.destroy();
    });

    test('should have correct schema definition', () => {
      const columns = dataSource.getMetadata(RoleEntity).columns;
      const columnNames = columns.map((col) => col.propertyName);
      expect(columnNames).toEqual(
        expect.arrayContaining([
          'id',
          'name',
          'status',
          'createdAt',
          'updatedAt',
        ]),
      );
    });

    test('should create a valid role', async () => {
      const role = roleRepository.create({
        name: 'Administrador de Sistema',
      });

      const savedRole = await roleRepository.save(role);
      expect(savedRole.id).toBeDefined();
      expect(savedRole.name).toBe(role.name);
    });

    test('should enforce unique name constraint', async () => {
      const role1 = roleRepository.create({
        name: 'Administrador de Sistema',
      });

      await roleRepository.save(role1);

      const role2 = roleRepository.create({
        name: 'Administrador de Sistema',
      });

      await expect(roleRepository.save(role2)).rejects.toThrow(QueryFailedError);
    });
  });
