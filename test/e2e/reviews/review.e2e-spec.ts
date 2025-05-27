import * as request from 'supertest';
import { server, token } from '../setup-e2e';

describe('ReviewController (e2e)', () => {
  let userId: number;
  let branchId: number;
  let reviewId: number;

  beforeAll(async () => {
    await request(server).post('/api/v2/social-networks').send({
      name: 'Facebook',
    });

    await request(server).post('/api/v2/stores').send({
      id: 1,
      name: 'Test Store',
      type_document: 'NIT',
      number_document: '900123456',
      logo: 'test-logo.png',
      phone_number: '3011234567',
      email: 'store@example.com',
      status: 'APPROVED',
    });

    const branch = await request(server)
      .post('/api/v2/branches')
      .send({
        id: 1,
        store_id: 1,
        name: 'New Branch',
        phone_number: '3001234567',
        latitude: 10.12345,
        longitude: -75.6789,
        address: '123 Main Street',
        social_branches: [
          {
            social_network_id: 1,
            value: 'https://facebook.com/mi-sucursal',
            description: 'Facebook oficial',
          },
        ],
      });

    branchId = branch.body.branch.id;

    const userData = {
      email: 'reviewclient@example.com',
      password: '12345',
    };

    const personData = {
      type_document: 'CC',
      number_document: '123456789',
      full_name: 'Review Client',
      phone_number: '3012345678',
    };

    const clientResponse = await request(server)
      .post('/api/v2/clients')
      .send({ userData, personData })
      .expect(201);

    userId = clientResponse.body.client.person.user_id;
  });

  it('/api/v2/reviews (POST) - should create a review', async () => {
    const reviewData = {
      branchId,
      userId,
      rating: 4,
      comment: 'Great place!',
      image_urls: ['http://example.com/image1.jpg'],
    };

    const response = await request(server)
      .post('/api/v2/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send(reviewData)
      .expect(201);

    reviewId = response.body.id;

    expect(response.body).toHaveProperty('id');
    expect(response.body.rating).toBe(4);
  });

  it('/api/v2/reviews/branch/:branchId (GET) - should return reviews by branch', async () => {
    const response = await request(server)
      .get(`/api/v2/reviews/branch/${branchId}`)
      .expect(200);

    expect(Array.isArray(response.body.reviews)).toBe(true);
    expect(response.body.reviews.length).toBeGreaterThan(0);

    const review = response.body.reviews.find((r) => r.id === reviewId);
    expect(review).toBeDefined();
  });

  it('/api/v2/reviews/client/:userId (GET) - should return reviews by client', async () => {
    const response = await request(server)
      .get(`/api/v2/reviews/client/${userId}`)
      .expect(200);

    expect(Array.isArray(response.body.reviews)).toBe(true);
    const review = response.body.reviews.find((r) => r.id === reviewId);
    expect(review).toBeDefined();
  });

  it('/api/v2/reviews/branch/:branchId (GET) - should return 404 if no reviews', async () => {
    const response = await request(server)
      .get('/api/v2/reviews/branch/999999')
      .expect(404);

    expect(response.body.message).toMatch(/not found/i);
  });

  it('/api/v2/reviews/client/:userId (GET) - should return 404 if no reviews', async () => {
    const response = await request(server)
      .get('/api/v2/reviews/client/999999')
      .expect(404);

    expect(response.body.message).toMatch(/not found/i);
  });
});
