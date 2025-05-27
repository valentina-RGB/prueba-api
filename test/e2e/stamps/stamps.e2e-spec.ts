import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { token, server } from '../setup-e2e';

describe('StampController (e2e)', () => {
  beforeAll(async () => {
    const album = await request(server)
      .post('/api/v2/albums')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Encafeinados - 2025',
        logo: 'https://res.cloudinary.com/dtnnyqa0g/image/upload/v1743789558/images-coffee/Captura%20de%20pantalla%202025-03-20%20185207.png.png',
        introduction:
          '¡Bienvenid@ a tu Pasaporte Cafetero! Aquí podrás coleccionar sellos de todas las cafeterías de especialidad que visites con Encafeinados. Cada logo representa una experiencia, un aroma, una taza que disfrutaste.¿Hasta dónde te llevará tu amor por el café?',
        type: 'ANNUAL',
        start_date: new Date(Date.UTC(2025, 0, 1, 12)),
        end_date: new Date(Date.UTC(2025, 11, 31, 12)),
        status: true,
      });

    await request(server)
      .post('/api/v2/pages')
      .set('Authorization', `Bearer ${token}`)
      .send({
        album_id: album.body.id,
        title: 'Página 1',
        description: 'Contiene los sellos de la cafeterías.',
        status: true,
      });

    await request(server).post('/api/v2/social-networks').send({
      name: 'Facebook',
      description: 'Facebook oficial',
      icon: 'https://example.com/icon.png',
    });
  });

  async function createStore() {
    const store = await request(server)
      .post('/api/v2/stores')
      .send({
        name: `Test Store ${uuidv4().substring(0, 8)}`,
        type_document: 'NIT',
        logo: 'exmple.png',
        number_document: `${Math.floor(100000000 + Math.random() * 900000000)}-${Math.floor(Math.random() * 10)}`,
        phone_number: `3${Math.floor(100000000 + Math.random() * 900000000)}`,
        email: `test${uuidv4().substring(0, 8)}@example.com`,
        status: 'ACTIVE',
      });

    return store.body.store;
  }

  async function createBranch() {
    const store = await createStore();

    const branch = await request(server)
      .post('/api/v2/branches')
      .send({
        name: `Test Branch ${uuidv4().substring(0, 8)}`,
        phone_number: '1234567890',
        latitude: 0,
        longitude: 0,
        address: 'Test Address',
        is_open: true,
        status: 'APPROVED',
        store_id: store.id,
        social_branches: [
          {
            social_network_id: 1,
            value: 'https://facebook.com/mi-sucursal',
            description: 'Facebook oficial',
          },
        ],
      });

    return branch.body.branch;
  }

  describe('GET /api/v2/stamps', () => {
    it('should return empty array when no stamps exist (200)', async () => {
      const res = await request(server)
        .get('/api/v2/stamps')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toEqual({
        message: 'Stamps fetched succesfully',
        stamps: [],
      });
    });

    it('should return all stamps (200)', async () => {
      const branch = await createBranch();
      const branch2 = await createBranch();

      const stampData1 = {
        name: branch.name,
        description: 'Test Description',
        coffeecoins_value: 10,
        status: true,
        branch_id: branch.id,
      };

      const stampData2 = {
        name: branch2.name,
        description: 'Test Description',
        coffeecoins_value: 20,
        status: true,
        branch_id: branch2.id,
      };

      await request(server)
        .post('/api/v2/stamps')
        .send(stampData1)
        .set('Authorization', `Bearer ${token}`);

      await request(server)
        .post('/api/v2/stamps')
        .send(stampData2)
        .set('Authorization', `Bearer ${token}`);

      const res = await request(server)
        .get('/api/v2/stamps')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.stamps.length).toBeGreaterThanOrEqual(2);
      expect(res.body.stamps).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: stampData1.name }),
          expect.objectContaining({ name: stampData2.name }),
        ]),
      );
    });
  });

  describe('POST /api/v2/stamps', () => {
    it('should create a new stamp (201)', async () => {
      const branch = await createBranch();

      const stamp = {
        name: branch.name,
        description: 'Test Description',
        coffeecoins_value: 10,
        status: true,
        branch_id: branch.id,
      };

      const response = await request(server)
        .post('/api/v2/stamps')
        .set('Authorization', `Bearer ${token}`)
        .send(stamp)
        .expect(201);

      expect(response).toBeDefined();
      expect(response).not.toBeNull();
      expect(response.body.stamp.name).toBe(stamp.name);
    });

    it('should return 404 if branch does not exist', async () => {
      const stamp = {
        name: 'Non-existent Branch',
        description: 'Test Description',
        coffeecoins_value: 10,
        status: true,
        branch_id: 999,
      };

      const res = await request(server)
        .post('/api/v2/stamps')
        .set('Authorization', `Bearer ${token}`)
        .send(stamp)
        .expect(404);

      expect(res.body.message).toBe('Branch not found');
    });

    it('should return 400 if branch is not approved', async () => {
      const store = await createStore();
      const branch = await request(server)
        .post('/api/v2/branches')
        .send({
          name: `Test Branch ${uuidv4().substring(0, 8)}`,
          phone_number: '1234567890',
          latitude: 0,
          longitude: 0,
          address: 'Test Address',
          is_open: true,
          status: 'PENDING',
          store_id: store.id,
          social_branches: [
            {
              social_network_id: 1,
              value: 'https://facebook.com/mi-sucursal',
              description: 'Facebook oficial',
            },
          ],
        });

      const stamp = {
        name: branch.body.branch.name,
        description: 'Test Description',
        coffeecoins_value: 10,
        status: true,
        branch_id: branch.body.branch.id,
      };

      const res = await request(server)
        .post('/api/v2/stamps')
        .set('Authorization', `Bearer ${token}`)
        .send(stamp)
        .expect(400);

      expect(res.body.message).toContain('Branch is not approved');
    });
  });

  describe('GET /api/v2/stamps/:id', () => {
    it('should return a stamp by id (200)', async () => {
      const branch = await createBranch();

      const stamp = {
        name: branch.name,
        description: 'Test Description',
        coffeecoins_value: 10,
        status: true,
        branch_id: branch.id,
      };

      const createRes = await request(server)
        .post('/api/v2/stamps')
        .set('Authorization', `Bearer ${token}`)
        .send(stamp);

      const stampId = createRes.body.stamp.id;

      const res = await request(server)
        .get(`/api/v2/stamps/${stampId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toEqual({
        message: 'Stamp fetched succesfully',
        stamp: expect.objectContaining({
          id: stampId,
          name: stamp.name,
        }),
      });
    });

    it('should return 404 for non-existent stamp (404)', async () => {
      await request(server)
        .get('/api/v2/stamps/9999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('should return 400 for invalid id format (400)', async () => {
      await request(server)
        .get('/api/v2/stamps/invalid-id')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });
});
