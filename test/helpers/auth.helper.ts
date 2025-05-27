import * as request from 'supertest';
import { server } from '../e2e/setup-e2e';
import { seedUsers } from 'src/modules/users/infrastructure/database/seeds/common/users.seed';
import { seedRoles } from 'src/modules/users/infrastructure/database/seeds/common/roles.seed';
import { DataSource } from 'typeorm';

export async function getAccessToken(dataSource: DataSource) {
  await seedRoles(dataSource);
  await seedUsers(dataSource);

  await request(server).get('/api/v2/users');

  const res = await request(server).post('/api/v2/auth/login').send({
    email: 'superadmin@example.com',
    password: '1234',
  });

  return res.body.accessToken;
}
