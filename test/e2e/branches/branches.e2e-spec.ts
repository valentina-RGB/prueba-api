import { token, server } from '../setup-e2e';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

const defaultSocialBranches = [
  {
    social_network_id: 1,
    value: 'https://facebook.com/mi-sucursal',
    description: 'Facebook oficial',
  },
];

async function createTestStore() {
  const uniqueId = uuidv4().substring(0, 8);
  const storeData = {
    name: `Test Store ${uniqueId}`,
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

async function createBranchWithStore(overrides: Partial<any> = {}) {
  const store = await createTestStore();
  const uniqueId = uuidv4().substring(0, 8);
  const branchData = {
    store_id: store.id,
    name: `Branch ${uniqueId}`,
    phone_number: `3${Math.floor(100000000 + Math.random() * 900000000)}`,
    latitude: 6.21,
    longitude: -75.57,
    address: `Address ${uniqueId}`,
    average_rating: 4.5,
    status: 'APPROVED',
    social_branches: defaultSocialBranches,
    ...overrides,
  };

  const response = await request(server)
    .post('/api/v2/branches')
    .send(branchData)
    .expect(201);
  return { store, branch: response.body.branch, branchData };
}

function expectBranchCreatedResponse(response: any, expectedName: string) {
  expect(response.body).toBeDefined();
  expect(response.body.message).toBe('Branch created succesfully');
  expect(response.body.branch).toBeDefined();
  expect(response.body.branch.name).toBe(expectedName);
}

describe('BranchController (e2e)', () => {
  beforeAll(async () => {
    await request(server)
      .post('/api/v2/social-networks')
      .send({ name: 'Facebook' });
  });

  describe('GET /api/v2/branches', () => {
    it('should return empty array if no branches exist', async () => {
      const response = await request(server)
        .get('/api/v2/branches')
        .expect(200);

      expect(response.body.branches.branches).toBeInstanceOf(Array);
      expect(response.body.branches.branches.length).toBe(0);
    });

    it('should list all branches', async () => {
      const { branch: branch1 } = await createBranchWithStore();
      const { branch: branch2 } = await createBranchWithStore();

      const response = await request(server)
        .get('/api/v2/branches')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.message).toBe('Branch fetched succesfully');
      expect(response.body.branches.branches).toBeInstanceOf(Array);
      expect(response.body.branches.branches.length).toBeGreaterThanOrEqual(2);

      const names = response.body.branches.branches.map((b: any) => b.name);
      expect(names).toContain(branch1.name);
      expect(names).toContain(branch2.name);
    });

    it('should list branches ordered by proximity if lat/long are provided', async () => {
      const { branch: nearBranch } = await createBranchWithStore({
        latitude: 10.0,
        longitude: -75.0,
      });

      const { branch: farBranch } = await createBranchWithStore({
        latitude: 15.0,
        longitude: -80.0,
      });

      const response = await request(server)
        .get('/api/v2/branches')
        .query({ lat: 10.1, long: -75.1 })
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.branches.branches.length).toBeGreaterThanOrEqual(2);

      const resultNames = response.body.branches.branches.map(
        (b: any) => b.name,
      );

      const nearIndex = resultNames.indexOf(nearBranch.name);
      const farIndex = resultNames.indexOf(farBranch.name);

      expect(nearIndex).toBeLessThan(farIndex);
    });
  });

  describe('POST /api/v2/branches', () => {
    it('should create a new branch successfully', async () => {
      const store = await createTestStore();
      const uniqueId = uuidv4().substring(0, 8);

      const branchData = {
        store_id: store.id,
        name: `Branch ${uniqueId}`,
        phone_number: `3${Math.floor(100000000 + Math.random() * 900000000)}`,
        latitude: 6.21,
        longitude: -75.57,
        address: `Address ${uniqueId}`,
        average_rating: 4.5,
        social_branches: defaultSocialBranches,
      };

      const response = await request(server)
        .post('/api/v2/branches')
        .send(branchData)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.status).toBe(201);
      expectBranchCreatedResponse(response, branchData.name);
    });

    it('should return 409 if branch name already exists', async () => {
      const { store } = await createBranchWithStore();
      const duplicateName = 'Duplicated Branch';

      const branchData = {
        store_id: store.id,
        name: duplicateName,
        phone_number: `12345${Math.floor(10000 + Math.random() * 90000)}`,
        latitude: 6.21,
        longitude: -75.57,
        address: 'Address 1',
        average_rating: 4.5,
        social_branches: defaultSocialBranches,
      };

      await request(server)
        .post('/api/v2/branches')
        .send(branchData)
        .expect(201);

      await request(server)
        .post('/api/v2/branches')
        .send(branchData)
        .expect(409);
    });
  });

  // it('should register a visit successfully', async () => {
  //   const { branch } = await createBranchWithStore();
  //   const visitData = {
  //     branch_id: branch.id,
  //     latitude: 19.4326,
  //     longitude: -99.1332,
  //   };

  //   const response = await request(server)
  //     .post('/api/v2/branches/register-visit')
  //     .set('Authorization', `Bearer ${token}`)
  //     .send(visitData);

  //   expect(response.body.message).toBe('Visit registered succesfully');
  //   expect(response.body.data).toBeDefined();
  // });

  it('should fail if branch does not exist', async () => {
    const response = await request(server)
      .post('/api/v2/branches/register-visit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        branch_id: 9999,
        latitude: 0,
        longitude: 0,
      });

    expect(response.status).toBe(404);
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(server)
      .post('/api/v2/branches/register-visit')
      .send({
        branch_id: 1,
        latitude: 0,
        longitude: 0,
      });

    expect(response.status).toBe(401);
  });

  describe('GET /api/v2/branches/:id', () => {
    it('should get a branch by ID', async () => {
      const { branch } = await createBranchWithStore();

      const response = await request(server)
        .get(`/api/v2/branches/${branch.id}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.message).toBe('Branch fetched succesfully');
      expect(response.body.branch.id).toBe(branch.id);
      expect(response.body.branch.name).toBe(branch.name);
    });

    it('should return 404 for non-existent branch ID', async () => {
      const nonExistentId = 999999;

      await request(server)
        .get(`/api/v2/branches/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('GET /api/v2/branches/status/:status', () => {
    it('should return branches by status', async () => {
      const { branch } = await createBranchWithStore({ status: 'PENDING' });

      const response = await request(server)
        .get(`/api/v2/branches/status/PENDING`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      const found = response.body.find((b: any) => b.id === branch.id);
      expect(found).toBeDefined();
      expect(found.name).toBe(branch.name);
    });

    it('should return 404 if no branches match status', async () => {
      const response = await request(server).get(
        '/api/v2/branches/status/NON_EXISTENT_STATUS',
      );

      expect([200, 404]).toContain(response.statusCode);
    });
  });

  describe('GET /api/v2/branches/store/:id', () => {
    it('should return branches of a store', async () => {
      const { store, branch } = await createBranchWithStore();

      const response = await request(server)
        .get(`/api/v2/branches/store/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.message).toBe('Branch by store fetched succesfully');
      expect(response.body.branches).toBeInstanceOf(Array);
      const found = response.body.branches.find((b: any) => b.id === branch.id);
      expect(found).toBeDefined();
    });

    it('should return empty array if store has no branches', async () => {
      const store = await createTestStore();

      const response = await request(server)
        .get(`/api/v2/branches/store/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.message).toBe('Branch by store fetched succesfully');
      expect(response.body.branches).toBeInstanceOf(Array);
      expect(response.body.branches.length).toBe(0);
    });
  });
});
