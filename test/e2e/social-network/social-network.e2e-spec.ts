import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';

describe('SocialNetworkController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get(DataSource);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await dataSource.query('DELETE FROM social_networks');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /social-networks', () => {
    it('should create a new social network', async () => {
      const payload = { name: 'Facebook' };

      const res = await request(httpServer)
        .post('/api/v2/social-networks')
        .send(payload)
        .expect(201);

      expect(res.body).toHaveProperty('message', 'Store created successfully');
      expect(res.body.social).toHaveProperty('id');
      expect(res.body.social.name).toBe('Facebook');
    });

    it('should not allow duplicate social network name', async () => {
      const payload = { name: 'Instagram' };

      await request(httpServer).post('/api/v2/social-networks').send(payload).expect(201);

      const res = await request(httpServer).post('/api/v2/social-networks').send(payload).expect(409);

      expect(res.body.message).toBe('Social Network already exists');
    });
  });

  describe('GET /social-networks', () => {
    it('should return an empty list initially', async () => {
      const res = await request(httpServer).get('/api/v2/social-networks').expect(200);
      expect(res.body.social).toEqual([]);
    });

    it('should return the list of created social networks', async () => {
      await request(httpServer).post('/api/v2/social-networks').send({ name: 'Twitter' });

      const res = await request(httpServer).get('/api/v2/social-networks').expect(200);

      expect(res.body.social.length).toBe(1);
      expect(res.body.social[0].name).toBe('Twitter');
    });
  });
});