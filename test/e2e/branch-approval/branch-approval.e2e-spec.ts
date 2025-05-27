import * as request from 'supertest';
import { server, token, dataSource } from '../setup-e2e';
import { seedPeople } from 'src/modules/users/infrastructure/database/seeds/common/people.seed';
import { seedAdmins } from 'src/modules/users/infrastructure/database/seeds/common/admins.seed';
import { seedStores } from 'src/modules/stores/infrastructure/database/seeders/common/store.seed';
import { seedBranches } from 'src/modules/stores/infrastructure/database/seeders/common/branch.seed';
import { seedCriteria } from 'src/modules/stores/infrastructure/database/seeders/common/criteria.seed';
import { seedAlbums } from 'src/modules/albums/infrastructure/database/seeders/album.seeder';
import { seedPages } from 'src/modules/albums/infrastructure/database/seeders/page.seeder';

describe('BranchApprovalController (e2e)', () => {
  let branchId: number;
  let approvalId: number;
  let criteriaId: number;
  let approvedById: number;

  beforeAll(async () => {
    await seedStores(dataSource);
    await seedBranches(dataSource);
    await seedPeople(dataSource);
    await seedAdmins(dataSource);
    await seedCriteria(dataSource);
    await seedAlbums(dataSource);
    await seedPages(dataSource);

    const admin = await request(server)
      .get('/api/v2/admin')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    approvedById = admin.body.admins[0].id;

    const branch = await request(server).get('/api/v2/branches').expect(200);
    branchId = branch.body.branches.branches[2].id;

    const criteria = await request(server)
      .get(`/api/v2/criteria/status/${true}`)
      .expect(200);
    criteriaId = criteria.body[0].id;
  });

  it('/api/v2/branch-approvals (POST) - should create a branch approval', async () => {
    const response = await request(server)
      .post('/api/v2/branch-approvals')
      .send({
        branchId,
        criteriaResponseData: [
          {
            criteriaId,
            response_text: 'Sí contamos con cinco cafés de especialidad.',
            image_url: 'http://example.com/image.jpg',
          },
        ],
      });

    approvalId = response.body.responseApproval.id;
    expect(response.status).toBe(201);
  });

  it('/api/v2/branch-approvals/detail/:id (GET) - should return branch approval detail', async () => {
    const response = await request(server)
      .get(`/api/v2/branch-approvals/detail/${branchId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('approvalId');
    expect(response.body.branch.id).toBe(branchId);
  });

  it('/api/v2/branch-approvals/:id (PATCH) - should update status', async () => {

    const response = await request(server)
      .patch(`/api/v2/branch-approvals/${approvalId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: true,
        approvedById,
      }).expect(200);

    expect(response.body.responseApproval.status).toBe('APPROVED');
  });

  it('/api/v2/branch-approvals/detail/:id (GET) - should return 404 for non-existent branch', async () => {
    const response = await request(server)
      .get('/api/v2/branch-approvals/detail/999999')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(response.body.message).toMatch(/not found/i);
  });
});
