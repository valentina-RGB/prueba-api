import { server } from '../setup-e2e';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

describe('StoreController (e2e)', () => {
  async function createTestStore() {
    const uniqueId = uuidv4().substring(0, 8);
    const storeData = {
      name: `Store ${uniqueId}`,
      type_document: 'NIT',
      number_document: `${Math.floor(100000000 + Math.random() * 900000000)}-${Math.floor(Math.random() * 10)}`,
      logo: 'https://example.com/logo.jpg',
      phone_number: `3${Math.floor(100000000 + Math.random() * 900000000)}`,
      email: `store${uniqueId}@example.com`,
    };

    const response = await request(server)
      .post('/api/v2/stores')
      .send(storeData)
      .expect(201);

    return response.body.store;
  }

  describe('GET /api/v2/stores', () => {
    it('should return empty array if no stores exist', async () => {
        const response = await request(server)
          .get('/api/v2/stores')
          .expect(200);
  
        expect(response.body.stores.stores).toBeInstanceOf(Array);
        expect(response.body.stores.stores.length).toBe(0);
      });

    it('should list all stores', async () => {
      const store1 = await createTestStore();
      const store2 = await createTestStore();

      const response = await request(server)
        .get('/api/v2/stores')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.message).toBe('Stores fetched successfully');
      expect(response.body.stores.stores).toBeInstanceOf(Array);
      expect(response.body.stores.stores.length).toBeGreaterThanOrEqual(2);

      const foundStore1 = response.body.stores.stores.find(
        (s: any) => s.name === store1.name,
      );
      const foundStore2 = response.body.stores.stores.find(
        (s: any) => s.name === store2.name,
      );

      expect(foundStore1).toBeDefined();
      expect(foundStore2).toBeDefined();
    }); 
  });

  describe('POST /api/v2/stores', () => {
    it('should create a new store successfully', async () => {
      const uniqueId = uuidv4().substring(0, 8);
      const storeData = {
        name: `Unique Store ${uniqueId}`,
        type_document: 'NIT',
        number_document: `${Math.floor(100000000 + Math.random() * 900000000)}-${Math.floor(Math.random() * 10)}`,
        logo: 'https://example.com/logo.jpg',
        phone_number: `311${Math.floor(1000000 + Math.random() * 9000000)}`,
        email: `unique${uniqueId}@example.com`,
      };

      const response = await request(server)
        .post('/api/v2/stores')
        .send(storeData)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.message).toBe('Store created successfully');
      expect(response.body.store).toBeDefined();
      expect(response.body.store.name).toBe(storeData.name);
    });

    it('should return 400 for invalid store data', async () => {
      const invalidStoreData = {
        name: '', 
        type_document: 'INVALID',
        number_document: '', 
        logo: 'invalid-url', 
        phone_number: '123', 
        email: 'invalid-email', 
      };

      await request(server)
        .post('/api/v2/stores')
        .send(invalidStoreData)
        .expect(400);
    });

    it('should return 409 if store email already exists', async () => {
        const uniqueEmail = 'duplicated@example.com';
    
        const storeData1 = {
          name: 'Store One',
          type_document: 'NIT',
          number_document: `${Math.floor(100000000 + Math.random() * 900000000)}-${Math.floor(Math.random() * 10)}`,
          logo: 'https://example.com/logo.jpg',
          phone_number: `311${Math.floor(1000000 + Math.random() * 9000000)}`,
          email: uniqueEmail,
        };
    
        const storeData2 = {
          name: 'Store Two',
          type_document: 'NIT',
          number_document: `${Math.floor(100000000 + Math.random() * 900000000)}-${Math.floor(Math.random() * 10)}`,
          logo: 'https://example.com/logo.jpg',
          phone_number: `322${Math.floor(1000000 + Math.random() * 9000000)}`,
          email: uniqueEmail, 
        };
    
        await request(server)
          .post('/api/v2/stores')
          .send(storeData1)
          .expect(201);
    
        await request(server)
          .post('/api/v2/stores')
          .send(storeData2)
          .expect(409);
      });
  });

  describe('GET /api/v2/stores/:id', () => {
    it('should get a store by ID successfully', async () => {
      const store = await createTestStore();

      const response = await request(server)
        .get(`/api/v2/stores/${store.id}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.message).toBe('Store fetched successfully');
      expect(response.body.store.id).toBe(store.id);
      expect(response.body.store.name).toBe(store.name);
    });

    it('should return 404 for non-existent store ID', async () => {
      const nonExistentId = 999999;

      await request(server)
        .get(`/api/v2/stores/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('GET /api/v2/stores/status/:status', () => {

    it('should return empty array if no stores exist for given status', async () => {
        const response = await request(server)
          .get(`/api/v2/stores/status/EJECTED`) 
          .expect(200);
      
        expect(response.body.stores).toBeInstanceOf(Array);
        expect(response.body.stores.length).toBe(0); 
      });
      
    it('should list stores by status', async () => {
      const store = await createTestStore(); 
  
      const response = await request(server)
        .get(`/api/v2/stores/status/APPROVED`) 
        .expect(200);
  
      expect(response.body.stores).toBeInstanceOf(Array);
      expect(response.body.stores.length).toBeGreaterThanOrEqual(1);
  
      const foundStore = response.body.stores.find(
        (s: any) => s.name === store.name,
      );
  
      expect(foundStore).toBeDefined();
    });
  });
  
  describe('PATCH /api/v2/stores/status/:id', () => {
    it('should update store status successfully', async () => {
      const store = await createTestStore();

      const response = await request(server)
        .patch(`/api/v2/stores/status/${store.id}`)
        .send({ status: true })
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.message).toBe('Store updated successfully');
      expect(response.body.store.status).toBe('APPROVED');
    });

    it('should return 404 for non-existent store ID', async () => {
      const nonExistentId = 999999;

      await request(server)
        .patch(`/api/v2/stores/status/${nonExistentId}`)
        .send({ status: true })
        .expect(404);
    });
  });
});
