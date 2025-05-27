import * as request from 'supertest';
import { server, token } from '../setup-e2e';

describe('AlbumController (e2e)', () => {
  let albumId: number;

  const createDto = {
    title: 'Álbum de prueba',
    introduction: 'Una introducción',
    logo: 'logo.png',
    type: 'ANNUAL',
    start_date: '2025-01-01',
    end_date: '2025-12-31',
  };

  describe('/POST albums', () => {
    it('should create a new album', async () => {
      const response = await request(server)
        .post('/api/v2/albums')
        .set('Authorization', `Bearer ${token}`)
        .send(createDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        title: createDto.title,
        introduction: createDto.introduction,
        logo: createDto.logo,
        type: createDto.type,
        start_date: createDto.start_date,
        end_date: createDto.end_date,
      });

      albumId = response.body.id;
    });
  });

  describe('/GET albums/:id', () => {
    it('should return the created album', async () => {
      const response = await request(server)
        .get(`/api/v2/albums/${albumId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: albumId,
        title: createDto.title,
        introduction: createDto.introduction,
      });
    });

    it('should return 404 for non-existent album', async () => {
      const response = await request(server)
        .get('/api/v2/albums/999999')
        .expect(404);

      expect(response.body.message).toContain('not found');
    });
  });

  describe('/GET albums', () => {
    it('should return a list of albums', async () => {
      const response = await request(server)
        .get('/api/v2/albums')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.albums).toBeInstanceOf(Array);
      expect(response.body.albums.length).toBeGreaterThan(0);
      expect(response.body.albums[0]).toHaveProperty('id');
    });
  });
});
