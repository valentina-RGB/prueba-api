import { token, server } from '../setup-e2e';
import * as request from 'supertest';

describe('RoleController (e2e)', () => {
  it('/api/v2/roles (POST) - should create a role', async () => {
    const response = await request(server)
      .post('/api/v2/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Admin' })
      .expect(201);

    expect(response.body.role).toHaveProperty('id');
    expect(response.body.role.name).toBe('Admin');
  });

  it('/api/v2/roles (GET) - should list all roles', async () => {
    await request(server)
      .post('/api/v2/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Client' })
      .expect(201);

    await request(server)
      .post('/api/v2/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Employee' })
      .expect(201);

    const response = await request(server)
      .get('/api/v2/roles')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body.roles.roles)).toBe(true);
    expect(response.body.roles.roles.length).toBeGreaterThanOrEqual(2);

    const role1 = response.body.roles.roles.find((u) => u.name === 'Client');
    const role2 = response.body.roles.roles.find((u) => u.name === 'Employee');

    expect(role1).toBeDefined();
    expect(role2).toBeDefined();
  });

  it('/api/v2/roles/:id (GET) - should get role by ID', async () => {
    const roleResponse = await request(server)
      .post('/api/v2/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Store Manager' })
      .expect(201);

    const roleId = roleResponse.body.role.id;

    const response = await request(server)
      .get(`/api/v2/roles/${roleId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.role).toHaveProperty('id', roleId);
    expect(response.body.role.name).toBe('Store Manager');
  });
});
