import { DataSource } from 'typeorm';
import { app, token, server } from '../setup-e2e';
import * as request from 'supertest';

describe('AdminController (e2e)', () => {
  let connection: DataSource;
  
  beforeAll(async () => {
    connection = app.get(DataSource);
    await connection.query('PRAGMA foreign_keys = OFF;');
  });

  afterAll(async () => {
    await connection.query('PRAGMA foreign_keys = ON;');
    await app.close();
  });

  it('/api/v2/admin/store-admin (POST) - should create a store-admin', async () => {
    const store = await request(server)
      .post('/api/v2/stores')
      .send({
        name: 'Store 1',
        type_document: 'NIT',
        number_document: '123456789-1',
        logo: 'logo.png',
        phone_number: '123456789',
        email: 'store@example.com',
        status: 'APPROVED',
      })
      .expect(201);

    const response = await request(server)
      .post('/api/v2/admin/store-admin')
      .send({
        storeData: { id: store.body.store.id },
        userData: {
          email: 'john@example.com',
          password: '1234',
        },
        personData: {
          type_document: 'CC',
          number_document: '123456',
          full_name: 'John Doe',
          phone_number: '1234567890',
        },
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.person.number_document).toBe('123456');
  });

  it('/api/v2/admin (GET) - should list all admins', async () => {
    const response = await request(server)
      .get('/api/v2/admin')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.admins).toBeInstanceOf(Array);
  });
});
