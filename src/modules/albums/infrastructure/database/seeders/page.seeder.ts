import { DataSource } from 'typeorm';
import { AlbumEntity } from '../../../infrastructure/entities/Album.entity';
import { PageEntity } from '../../entities/page.entity';

export const seedPages = async (dataSource: DataSource) => {
  const pageRepo = dataSource.getRepository(PageEntity);
  const albumRepo = dataSource.getRepository(AlbumEntity);

  const pages = [
    {
      id: 1,
      album: await albumRepo.findOne({ where: { id: 1 } }),
      title: 'Página 1',
      description: 'Contiene los sellos de la cafeterías.',
      status: true,
    },
  ];

  for (const page of pages) {
    const exists = await pageRepo.findOne({ where: { title: page.title } });

    if (exists) {
      exists.id = page.id;
      exists.album = page.album!;
      exists.title = page.title;
      exists.description = page.description;
      exists.status = page.status;

      await pageRepo.save(exists);
    } else {
      const newPage = pageRepo.create({
        id: page.id,
        album: page.album!,
        title: page.title,
        description: page.description,
        status: page.status,
      });
      await pageRepo.save(newPage);
    }
  }
  console.log('✅ Page seeders inserted successfully.');
};
