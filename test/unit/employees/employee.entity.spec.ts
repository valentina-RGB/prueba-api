import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../../../src/config/data-source';
import { EmployeEntity } from 'src/modules/users/infrastructure/entities/employe.entity';

describe('EmployeEntity - Entity Structure Tests', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(AppDataSource.options)],
    }).compile();

    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
  });

  afterAll(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });

  test('should have correct schema definition', () => {
    const columns = dataSource.getMetadata(EmployeEntity).columns;
    const columnNames = columns.map((col) => col.propertyName);

    expect(columnNames).toEqual(
      expect.arrayContaining([
        'id',
        'employee_type',
        'person',
        'branch',
        'createdAt',
        'updatedAt',
      ]),
    );
  });
});
