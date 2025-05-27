import * as request from 'supertest';
import { server, token, dataSource } from '../setup-e2e';
import { HttpStatus } from '@nestjs/common';
import { seedStores } from 'src/modules/stores/infrastructure/database/seeders/common/store.seed';
import { seedBranches } from 'src/modules/stores/infrastructure/database/seeders/common/branch.seed';

describe('ImageController (e2e)', () => {
  let branchId: number;
  let imageId: number;

  beforeAll(async () => {
    await seedStores(dataSource);
    await seedBranches(dataSource);

    const branch = await request(server).get('/api/v2/branches');
    branchId = branch.body.branches.branches[0].id;

    const image = await request(server)
      .post('/api/v2/images')
      .set('Authorization', `Bearer ${token}`)
      .send({
        related_type: 'BRANCH',
        related_id: branchId,
        images: [
          {
            image_type: 'logo',
            image_url: 'http://example.com/image1.jpg',
          },
        ],
      });

    imageId = image.body[0].id;
  });

  describe('GET /api/v2/images/branch/:branchId', () => {
    it('should return images by branch ID', async () => {
      const response = await request(server)
        .get(`/api/v2/images/branch/${branchId}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('images');

      expect(Array.isArray(response.body.images)).toBe(true);
      expect(response.body.images.length).toBeGreaterThan(0);

      const fetchedImage = response.body.images.find(
        (img) => img.id === imageId,
      );
      expect(fetchedImage).toBeDefined();
      expect(fetchedImage.image_url).toBe('http://example.com/image1.jpg');
    });

    it('should return 404 if branch does not exist', async () => {
      const response = await request(server)
        .get('/api/v2/images/branch/999999')
        .expect(404);

      expect(response.body.message).toMatch(/Branch not found/i);
    });
  });

  describe('POST /api/v2/images', () => {
    it('/api/v2/images (POST) should create images', async () => {
      const payload = {
        related_type: 'BRANCH',
        related_id: branchId,
        images: [
          {
            image_type: 'LOGO',
            image_url: 'https://example.com/logo.jpg',
          },
          {
            image_type: 'GALLERY',
            image_url: 'https://example.com/gallery.jpg',
          },
        ],
      };

      const res = await request(server)
        .post('/api/v2/images')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(HttpStatus.CREATED);

      expect(res.body).toBeDefined();
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0].related_type).toBe('BRANCH');
    });
  });
});
