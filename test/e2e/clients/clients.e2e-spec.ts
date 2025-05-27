import { server } from '../setup-e2e';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

describe('ClientController', () => {
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
      password: '1234',
    };

    const personData = {
      type_document: 'CC',
      number_document: testData.documentNumber,
      full_name: 'Test Client',
      phone_number: testData.phone,
    };

    const response = await request(server).post('/api/v2/clients').send({
      userData,
      personData,
    });

    return response.body;
  }

  describe('POST /api/v2/clients', () => {
    it('should register a new client successfully', async () => {
      await request(server).post('/api/v2/roles').send({ name: 'Cliente' });

      const testData = generateUniqueTestData();

      const userData = {
        email: testData.email,
        password: '1234',
      };

      const personData = {
        type_document: 'CC',
        number_document: testData.documentNumber,
        full_name: 'New Client',
        phone_number: testData.phone,
      };

      const response = await request(server)
        .post('/api/v2/clients')
        .send({
          userData,
          personData,
        })
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.client.person.user_email).toBe(userData.email);
      expect(response.body.client.person.full_name).toBe(personData.full_name);
    });

    it('should return 409 if email already exists', async () => {
      const existingClient = await createTestClient();

      const duplicateUserData = {
        email: existingClient.client.person.user_email,
        password: '1234',
      };

      const personData = {
        type_document: 'CC',
        number_document: generateUniqueTestData().documentNumber,
        full_name: 'Duplicate Client',
        phone_number: generateUniqueTestData().phone,
      };

      await request(server)
        .post('/api/v2/clients')
        .send({
          userData: duplicateUserData,
          personData,
        })
        .expect(409);
    });

    it('should return 400 if registration data is invalid', async () => {
      const invalidUserData = {
        email: 'invalid-email',
        password: 'short',
      };

      const personData = {
        type_document: 'CC',
        number_document: '14',
        full_name: 'Invalid Client',
        phone_number: '987654321',
      };

      await request(server)
        .post('/api/v2/clients')
        .send({
          userData: invalidUserData,
          personData,
        })
        .expect(400);
    });
  });

  describe('GET /api/v2/clients', () => {
    it('should return a list of clients', async () => {
      const response = await request(server).get('/api/v2/clients').expect(200);
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body.clients)).toBe(true);
    });
  });

  describe('GET /api/v2/clients/:id', () => {
    it('should return a client by ID', async () => {
      const testClient = await createTestClient();

      const response = await request(server)
        .get(`/api/v2/clients/${testClient.client.id}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(testClient.client.id);
    });

    it('should return 404 if client not found', async () => {
      const nonExistentClientId = '99999999';
      await request(server)
        .get(`/api/v2/clients/${nonExistentClientId}`)
        .expect(404);
    });

    it('should return 400 if ID is invalid', async () => {
      await request(server).get('/api/v2/clients/invalid-id').expect(400);
    });
  });

  describe('GET /api/v2/clients/user/:id', () => {
    it('should return a client by user ID', async () => {
      const testClient = await createTestClient();

      const response = await request(server)
        .get(`/api/v2/clients/user/${testClient.client.person.user_id}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(testClient.client.id);
    });

    it('should return 404 if client not found', async () => {
      const nonExistentUserId = '99999999';
      await request(server)
        .get(`/api/v2/clients/user/${nonExistentUserId}`)
        .expect(404);
    });
  });

  describe('PATCH /api/v2/clients/:id', () => {
    it('should update a client successfully', async () => {
      const testClient = await createTestClient();

      const client = await request(server)
        .get(`/api/v2/clients/${testClient.client.id}`)
        .expect(200);

      const userId = client.body.person.user_id;

      const updatedData = {
        full_name: 'Updated Client',
        phone_number: '987654321',
      };

      const response = await request(server)
        .patch(`/api/v2/clients/${userId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.client.person.full_name).toBe(updatedData.full_name);
    });

    it('should return 404 if client not found', async () => {
      const nonExistentClientId = '99999999';
      const updatedData = {
        full_name: 'Updated Client',
        phone_number: '987654321',
      };

      await request(server)
        .patch(`/api/v2/clients/${nonExistentClientId}`)
        .send(updatedData)
        .expect(404);
    });
  });
});
