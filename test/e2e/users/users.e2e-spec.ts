import { server, token } from '../setup-e2e';

import * as request from 'supertest';

describe('UsersController (e2e)', () => {
  async function getValidRole() {
    const existingRoles = await request(server)
      .get('/api/v2/roles')
      .set('Authorization', `Bearer ${token}`)

    const adminRole = existingRoles.body.roles.roles.find(
      (r) => r.name === 'Admin',
    );

    if (adminRole) return adminRole.id;

    const roleResponse = await request(server)
      .post('/api/v2/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Admin' })
      .expect(201);

    return roleResponse.body.role;
  }

  it('/api/v2/users (POST) - should create a user', async () => {
    const role = await getValidRole();

    const response = await request(server)
      .post('/api/v2/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        role,
        email: 'john@example.com',
        password: '12345',
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.email).toBe('john@example.com');
  });

  it('/api/v2/users (GET) - should list all users', async () => {
    const role = await getValidRole();

    await request(server)
      .post('/api/v2/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        role,
        email: 'andres@example.com',
        password: '12345',
      })
      .expect(201);

    await request(server)
      .post('/api/v2/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        role,
        email: 'camila@example.com',
        password: '12345',
      })
      .expect(201);

    const response = await request(server)
      .get('/api/v2/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body.users.users)).toBe(true);
    expect(response.body.users.users.length).toBeGreaterThanOrEqual(2);

    const user1 = response.body.users.users.find(
      (u) => u.email === 'andres@example.com',
    );
    const user2 = response.body.users.users.find(
      (u) => u.email === 'camila@example.com',
    );

    expect(user1).toBeDefined();
    expect(user2).toBeDefined();
  });

  it('/api/v2/users/:id (GET) - should get user by ID', async () => {
    const role = await getValidRole();

    const userResponse = await request(server)
      .post('/api/v2/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        role,
        email: 'bruce@wayne.com',
        password: '12345',
      })
      .expect(201);

    const userId = userResponse.body.user.id;

    const response = await request(server)
      .get(`/api/v2/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.user).toHaveProperty('id', userId);
    expect(response.body.user.email).toBe('bruce@wayne.com');
  });

  it('api/v2/users/:id (UPDATE) - should update user by ID', async () => {
    const role = await getValidRole();

    const userResponse = await request(server)
      .post('/api/v2/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        role,
        email: 'alisson@example.com',
        password: '123456',
      })
      .expect(201);

    const userId = userResponse.body.user.id;

    const userUpdated = await request(server)
      .patch(`/api/v2/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'ali@example.com' })
      .expect(200);

    expect(userUpdated.body.user).toHaveProperty('id', userId);
    expect(userUpdated.body.user.id).toBe(userId);
    expect(userUpdated.body.user.email).toBe('ali@example.com');

    const getUser = await request(server)
      .get(`/api/v2/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getUser.body.user.email).toBe('ali@example.com');
  });

  it('/api/v2/users/:id (DELETE) - should delete user by ID', async () => {
    const role = await getValidRole();

    const userResponse = await request(server)
      .post('/api/v2/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        role,
        email: 'wick@example.com',
        password: '12345',
      })
      .expect(201);

    const userId = userResponse.body.user.id;

    await request(server)
      .delete(`/api/v2/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    await request(server)
      .get(`/api/v2/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
