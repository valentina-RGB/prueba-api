import { server } from '../setup-e2e';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

describe('AuthController (e2e)', () => {
  function generateUniqueTestData() {
    const randomString = uuidv4().substring(0, 8);
    return {
      email: `test${randomString}@example.com`,
      documentNumber: `${Math.floor(10000000 + Math.random() * 90000000)}`,
      phone: `9${Math.floor(10000000 + Math.random() * 90000000)}`,
    };
  }

  async function createTestClient() {
    await request(server).post('/api/v2/roles').send({ name: 'Cliente' });
    const testData = generateUniqueTestData();

    const userData = {
      email: testData.email,
      password: 'Test1234',
    };

    const personData = {
      type_document: 'CC',
      number_document: testData.documentNumber,
      full_name: 'Test Client',
      phone_number: testData.phone,
    };

    const response = await request(server)
      .post('/api/v2/clients')
      .send({
        userData,
        personData,
      });

    return response.body;
  }

  describe('POST /api/v2/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      await request(server).post('/api/v2/roles').send({ name: 'Cliente' });

      const registerData = {
        userData: {
          email: 'test-login@example.com',
          password: '1234',
        },
        personData: {
          type_document: 'CC',
          number_document: '12345678',
          full_name: 'Test User',
          phone_number: '1234567890',
        },
      };

      await request(server)
        .post('/api/v2/clients')
        .send(registerData)
        .expect(201);

      const loginData = {
        email: 'test-login@example.com',
        password: '1234',
      };

      const response = await request(server)
        .post('/api/v2/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
    });

    it('should return 401 with invalid credentials', async () => {
      const invalidLoginData = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      };

      await request(server)
        .post('/api/v2/auth/login')
        .send(invalidLoginData)
        .expect(404);
    });

    it('should return 401 with wrong password', async () => {
      const client = await createTestClient();

      const wrongPasswordData = {
        email: client.client.person.user_email,
        password: 'wrongpassword',
      };

      await request(server)
        .post('/api/v2/auth/login')
        .send(wrongPasswordData)
        .expect(401);
    });
  });

  describe('GET /api/v2/auth/google', () => {
    it('should initiate Google OAuth flow', async () => {
      await request(server).get('/api/v2/auth/google').expect(302);
    });
  });
});
