import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { GetCriteriaUseCase } from 'src/modules/stores/application/use-cases/criteria/get-criteria-by-id.use-case';
import { ListCriteriaByStatusUseCase } from 'src/modules/stores/application/use-cases/criteria/list-criteria-by-status.use-case';

import { NotFoundException } from '@nestjs/common';
describe('CriteriaController (e2e)', () => {
  let app: INestApplication;

  const mockCriteria = {
    id: 1,
    name: 'Mock Criteria',
    active: true,
    description: 'Description Criteria',
    requires_image: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockGetCriteriaUseCase = {
    execute: jest.fn((id: number) => {
      if (id === 1) return Promise.resolve(mockCriteria);
      throw new NotFoundException('Criteria not found');
    }),
  };

  const mockListCriteriaByStatusUseCase = {
    execute: jest.fn((status: boolean) => {
      if (status) return Promise.resolve([mockCriteria]);
      return Promise.resolve([]);
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GetCriteriaUseCase)
      .useValue(mockGetCriteriaUseCase)
      .overrideProvider(ListCriteriaByStatusUseCase)
      .useValue(mockListCriteriaByStatusUseCase)
      .compile();
  
    app = moduleFixture.createNestApplication();
    await app.init();
  });  

  afterAll(async () => {
    await app.close();
  });

  describe('api/v2/criteria/:id (GET)', () => {
    it('should return criteria by id', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v2/criteria/1')
        .expect(200);

      expect(res.body).toHaveProperty(
        'message',
        'Criteria fetched successfully',
      );
      expect(res.body).toHaveProperty('criteria');
      expect(res.body.criteria).toEqual(mockCriteria);
    });

    it('should return 404 if not found', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v2/criteria/999')
        .expect(404);

      expect(res.body.message).toBe('Criteria not found');
    });
  });

  describe('api/v2/criteria/status/:status (GET)', () => {
    it('should return criteria list by status=true', async () => {
      const res = await request(app.getHttpServer()).get(
        '/api/v2/criteria/status/true',
      );

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should return empty array for status=false', async () => {
      const res = await request(app.getHttpServer()).get(
        '/api/v2/criteria/status/false',
      );

      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
