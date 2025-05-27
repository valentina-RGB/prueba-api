import { DataSource } from 'typeorm';
import { AlbumEntity } from '../../entities/Album.entity';

export const seedAlbums = async (dataSource: DataSource) => {
  try {
    const albumRepository = dataSource.getRepository(AlbumEntity);

    const albums = [
      {
        id: 1,
        title: 'Encafeinados - 2025',
        logo: 'https://res.cloudinary.com/dtnnyqa0g/image/upload/v1743789558/images-coffee/Captura%20de%20pantalla%202025-03-20%20185207.png.png',
        introduction:
          '¡Bienvenid@ a tu Pasaporte Cafetero! Aquí podrás coleccionar sellos de todas las cafeterías de especialidad que visites con Encafeinados. Cada logo representa una experiencia, un aroma, una taza que disfrutaste.¿Hasta dónde te llevará tu amor por el café?',
        type: 'ANNUAL',
        entity_id: null,
        start_date: new Date(Date.UTC(2025, 0, 1, 12)),
        end_date: new Date(Date.UTC(2025, 11, 31, 12)),
        status: true,
      },
    ];

    for (const album of albums) {
      const exists = await albumRepository.findOne({
        where: { title: album.title },
      });

      if (exists) {
        exists.id = album.id;
        exists.logo = album.logo;
        exists.introduction = album.introduction;
        exists.type = album.type;
        exists.start_date = album.start_date;
        exists.end_date = album.end_date;
        exists.status = album.status;

        await albumRepository.save(exists);
      } else {
        const newAlbum = albumRepository.create({
          id: album.id,
          title: album.title,
          logo: album.logo,
          introduction: album.introduction,
          type: album.type,
          start_date: album.start_date,
          end_date: album.end_date,
          status: album.status,
        });
        await albumRepository.save(newAlbum);
      }
    }

    console.log('✅ Album seeders inserted successfully.');
  } catch (error) {
    console.error('❌ Error inserting album seeders:', error);
  }
};
