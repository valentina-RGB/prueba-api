import * as request from 'supertest';
import { server, token } from '../setup-e2e';

describe('BranchScheduleController (e2e)', () => {
  let branchId: number;
  let scheduleId: number;
  let storeId: number;

  beforeAll(async () => {
    await request(server).post('/api/v2/social-networks').send({
      name: 'Facebook',
    });
    // Create a test store
    const store = await request(server).post('/api/v2/stores').send({
      id: 1,
      name: 'Test Store',
      type_document: 'NIT',
      number_document: '900123456',
      logo: 'test-logo.png',
      phone_number: '3011234567',
      email: 'store@example.com',
      status: 'APPROVED',
    });

    storeId = store.body.store.id;

    // Create a test branch
    const branch = await request(server)
      .post('/api/v2/branches')
      .send({
        store_id: storeId,
        name: 'New Branch',
        phone_number: '3001234567',
        latitude: 10.12345,
        longitude: -75.6789,
        address: '123 Main Street',
        status: 'APPROVED',
        social_branches: [
          {
            social_network_id: 1,
            value: 'https://facebook.com/mi-sucursal',
            description: 'Facebook oficial',
          },
        ],
      });

    branchId = branch.body.branch.id;
  });

  it('/api/v2/branch-schedule (POST) - should create a branch schedule', async () => {
    const scheduleData = {
      branch_id: branchId,
      day: 'Thursday',
      open_time: '08:00',
      close_time: '17:00',
    };

    const response = await request(server)
      .post('/api/v2/branch-schedule')
      .set('Authorization', `Bearer ${token}`)
      .send(scheduleData)
      .expect(201);

    scheduleId = response.body.id;

    expect(response.body).toHaveProperty('id');
    expect(response.body.day).toBe('Thursday');
    expect(response.body.open_time).toBe('08:00');
    expect(response.body.close_time).toBe('17:00');
  });

  it('/api/v2/branch-schedule (POST) - should return 409 if schedule already exists', async () => {
    const duplicateScheduleData = {
      branch_id: branchId,
      day: 'Thursday',
      open_time: '08:00',
      close_time: '17:00',
    };

    const response = await request(server)
      .post('/api/v2/branch-schedule')
      .set('Authorization', `Bearer ${token}`)
      .send(duplicateScheduleData)
      .expect(409);

    expect(response.body.message).toBe(
      'You already have a schedule assigned for the day Thursday',
    );
  });

  it('/api/v2/branch-schedule (POST) - should return 401 if token is expired or invalid', async () => {
    const scheduleData = {
      branch_id: branchId,
      day: 'Friday',
      open_time: '09:00',
      close_time: '18:00',
    };

    const response = await request(server)
      .post('/api/v2/branch-schedule')
      .set('Authorization', `Bearer INVALID_TOKEN`)
      .send(scheduleData)
      .expect(401);

    expect(response.body.message).toBe('Invalid token or expired');
  });

  it('/api/v2/branch-schedule (POST) - should return 404 if branch does not exist', async () => {
    const invalidBranchSchedule = {
      branch_id: 9999, // Non-existent branch
      day: 'Monday',
      open_time: '08:00',
      close_time: '17:00',
    };

    const response = await request(server)
      .post('/api/v2/branch-schedule')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBranchSchedule)
      .expect(404);

    expect(response.body.message).toBe('Branch not found');
  });

  it('/api/v2/branch-schedule/branch/:branchId (GET) - should return schedules by branch ID', async () => {
    const response = await request(server)
      .get(`/api/v2/branch-schedule/branch/${branchId}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    const schedule = response.body.find((s) => s.id === scheduleId);
    expect(schedule).toBeDefined();
    expect(schedule.day).toBe('Thursday');
  });

  it('/api/v2/branch-schedule/branch/:branchId (GET) - should return 404 if no schedules exist', async () => {
    const response = await request(server)
      .get('/api/v2/branch-schedule/branch/999999')
      .expect(404);

    expect(response.body.message).toMatch('Branch not found');
  });
});
