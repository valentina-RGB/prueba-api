import * as request from 'supertest';
import { server, token } from '../setup-e2e';

describe('PeopleController (e2e)', () => {
  let createdPersonId: number;

  beforeAll(async () => {

    const userData = {
      email: 'person@example.com',
      password: '1234',
    };

    const personData = {
      type_document: 'CC',
      number_document: '100520052',
      full_name: 'New Client',
      phone_number: '3269874521',
    };

    const response = await request(server)
      .post('/api/v2/clients')
      .send({
        userData,
        personData,
      })
      .expect(201);

    createdPersonId = response.body.client.person.id;
  });

  it('/api/v2/people (GET) - should return all people', async () => {
    const response = await request(server).get('/api/v2/people').expect(200);

    expect(Array.isArray(response.body.people)).toBe(true);
    expect(response.body.people.length).toBeGreaterThan(0);

    const person = response.body.people.find((p) => p.id === createdPersonId);
    expect(person).toBeDefined();
  });

  it('/api/v2/people/:id (GET) - should return one person by ID', async () => {
    const response = await request(server)
      .get(`/api/v2/people/${createdPersonId}`)
      .expect(200);

    expect(response.body.person).toHaveProperty('id', createdPersonId);
    expect(response.body.message).toBe('Person fetched succesfully');
  });

  it('/api/v2/people/:id (GET) - should return 404 if person does not exist', async () => {
    const nonExistingId = 999999;

    const response = await request(server)
      .get(`/api/v2/people/${nonExistingId}`)
      .expect(404);

    expect(response.body.message).toMatch(/not found/i);
  });
});
