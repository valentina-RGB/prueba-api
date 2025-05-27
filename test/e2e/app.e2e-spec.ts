import { server } from './setup-e2e';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  it('/ (GET) - should return "Hello World!"', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });
});