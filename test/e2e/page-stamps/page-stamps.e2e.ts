import * as request from 'supertest';
import { server, token } from '../setup-e2e';

describe('PageStampsController (e2e)', () => {
  let pageId: number;

  const createStampDto = {
    album_id: 1,
    page_id: 1,
    title: 'Sello de prueba',
    description: 'Descripción del sello',
    status: true,
  };

  describe('/POST pages-stamps', () => {
    it('should register a new stamp on a page', async () => {
      const response = await request(server)
        .post('/api/v2/pages-stamps')
        .set('Authorization', `Bearer ${token}`)
        .send(createStampDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        album_id: createStampDto.album_id,
        page_id: createStampDto.page_id,
        title: createStampDto.title,
        description: createStampDto.description,
        status: createStampDto.status,
      });

      pageId = response.body.page_id;
    });
  });

  describe('/GET pages-stamps/:pageId', () => {
    it('should return stamps for the specified page', async () => {
      await request(server)
        .post('/api/v2/pages-stamps')
        .set('Authorization', `Bearer ${token}`)
        .send(createStampDto)
        .expect(201);

      const response = await request(server)
        .get(`/api/v2/pages-stamps/${pageId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.stamps).toBeInstanceOf(Array);
      expect(response.body.stamps.length).toBeGreaterThan(0);
      expect(response.body.stamps[0]).toHaveProperty(
        'title',
        createStampDto.title,
      );
    });

    it('should return 404 if stamps for this page does not exist', async () => {
      const response = await request(server)
        .get('/api/v2/pages-stamps/3')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.message).toBe('No stamps found for this page');
    });
  });
});
