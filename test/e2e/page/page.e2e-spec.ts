import * as request from 'supertest';
import { token, server } from '../setup-e2e';

describe('PagesController (e2e)', () => {
  let albumId: number;
  let albumTitle: string;

  describe('/POST pages', () => {
    beforeAll(async () => {
      const albumResponse = await request(server)
        .post('/api/v2/albums')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Álbum de prueba',
          introduction: 'Descripción del álbum',
          logo: 'logo.png',
          type: 'ANNUAL',
          start_date: '2025-01-01',
          end_date: '2025-12-31',
        })
        .expect(201);

      albumId = albumResponse.body.id;
      albumTitle = albumResponse.body.title;
    });

    it('should create a new page', async () => {
      const pageData = {
        album_id: albumId,
        title: 'Página de prueba',
        description: 'Descripción de la página',
        status: true,
      };

      const response = await request(server)
        .post('/api/v2/pages')
        .set('Authorization', `Bearer ${token}`)
        .send(pageData)
        .expect(201);

      expect(response.body).toMatchObject({
        album: {
          album_id: albumId,
          album_title: albumTitle,
        },
        id: expect.any(Number),
        title: 'Página de prueba',
        description: 'Descripción de la página',
        status: true,
      });
    });
  });

  describe('/GET pages/album/:albumId', () => {
    it('should return list of pages for the album', async () => {
      await request(server)
        .post('/api/v2/pages')
        .set('Authorization', `Bearer ${token}`)
        .send({
          album_id: albumId,
          title: 'Página 1',
          description: 'Primera página',
          status: true,
        })
        .expect(201);

      await request(server)
        .post('/api/v2/pages')
        .set('Authorization', `Bearer ${token}`)
        .send({
          album_id: albumId,
          title: 'Página 2',
          description: 'Segunda página',
          status: true,
        })
        .expect(201);

      const response = await request(server)
        .get(`/api/v2/pages/album/${albumId}`)
        .expect(200);

      expect(response.body.pages).toBeInstanceOf(Array);
      expect(response.body.pages.length).toBeGreaterThanOrEqual(2);
      expect(response.body.pages[0]).toHaveProperty('title');
    });

    it('should return 404 if album does not exist', async () => {
      const response = await request(server)
        .get(`/api/v2/pages/album/999999`)
        .expect(404);

      expect(response.body.message).toBe('Album with ID 999999 not found');
    });
  });
});
