import { DataSource } from 'typeorm';
import { StampsEntity } from '../../entities/stamps.entity';
import { BranchesEntity } from 'src/modules/stores/infrastructure/entities/branches.entity';

export const seedStamps = async (dataSource: DataSource) => {
  try {
    const stampsRepository = dataSource.getRepository(StampsEntity);
    const branchesRepository = dataSource.getRepository(BranchesEntity);

    const branch1 = await branchesRepository.findOne({ where: { id: 1 } });
    const branch2 = await branchesRepository.findOne({ where: { id: 2 } });
    const stamps = [
      {
        id: 1,
        branch: branch1,
        name: 'Zentea - Poblado',
        logo: 'https://res.cloudinary.com/dtnnyqa0g/image/upload/v1743630974/images-coffee/Captura%20de%20pantalla%202025-03-20%20184844.png.png',
        description:
          'Sello que registra una nueva experiencia de café premium.',
        status: true,
      },
      {
        id: 2,
        branch: branch2,
        name: 'Encafeinados - Sabaneta',
        logo: 'https://res.cloudinary.com/dtnnyqa0g/image/upload/v1743630974/images-coffee/Captura%20de%20pantalla%202025-03-20%20184844.png.png',
        description:
          'Sello que registra una nueva experiencia de café premium.',
        status: true,
      },
    ];

    for (const stampData of stamps) {
      const existingStamp = await stampsRepository.findOne({
        where: { name: stampData.name },
      });

      if (existingStamp) {
        existingStamp.id = stampData.id;
        existingStamp.logo = stampData.logo;
        existingStamp.name = stampData.name;
        existingStamp.description = stampData.description;
        existingStamp.status = stampData.status;
        existingStamp.branch = stampData.branch!;

        await stampsRepository.save(existingStamp);
      } else {
        const newStamp = stampsRepository.create({
          id: stampData.id,
          logo: stampData.logo,
          name: stampData.name,
          description: stampData.description,
          status: stampData.status,
          branch: stampData.branch!,
        });

        await stampsRepository.save(newStamp);
      }
    }

    console.log('✅ Stamps seeders inserted successfully.');
  } catch (error) {
    console.error('❌ Error inserting stamps seeders:', error);
  }
};
