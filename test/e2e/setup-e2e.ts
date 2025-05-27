import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { AppDataSource } from '../../src/config/data-source';
import { getAccessToken } from 'test/helpers/auth.helper';
import { DataSource } from 'typeorm';

export let app: INestApplication;
export let server: any;
export let token: string;
export let dataSource: DataSource;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.init();
  server = app.getHttpServer();
  dataSource = app.get(DataSource);
  token = await getAccessToken(dataSource);
});

beforeEach(async () => {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName};`);
    await repository.query(
      `DELETE FROM sqlite_sequence WHERE name='${entity.tableName}';`,
    );
  }
});

afterAll(async () => {
  await AppDataSource.destroy();
  await app.close();
});