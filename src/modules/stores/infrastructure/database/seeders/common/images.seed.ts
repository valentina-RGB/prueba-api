import { DataSource } from 'typeorm';
import { BranchesEntity } from '../../../entities/branches.entity';
import { ImageEntity } from '../../../entities/images.entity';

export const seedImagesBranch = async (dataSource: DataSource) => {
  try {
    const branchRepository = dataSource.getRepository(BranchesEntity);
    const imagesRepository = dataSource.getRepository(ImageEntity);

    const branch1 = await branchRepository.findOne({ where: { id: 1 } });
    const branch2 = await branchRepository.findOne({ where: { id: 2 } });

    const imagesList = [
      {
        id: 1,
        image_type: 'MÁQUINAS',
        related_type: 'BRANCH',
        related_id: branch1!.id,
        image_url:
          'https://res.cloudinary.com/dtnnyqa0g/image/upload/v1746729695/Maquina_1_ynavrm.jpg',
      },
      {
        id: 2,
        image_type: 'EXTERIOR',
        related_type: 'BRANCH',
        related_id: branch1!.id,
        image_url:
          'https://res.cloudinary.com/dtnnyqa0g/image/upload/v1746729692/Exterior_1_yvqrik.jpg',
      },
      {
        id: 3,
        image_type: 'MÁQUINAS',
        related_type: 'BRANCH',
        related_id: branch2!.id,
        image_url:
          'https://res.cloudinary.com/dtnnyqa0g/image/upload/v1746729693/maquina_2_p3undr.webp',
      },
      {
        id: 4,
        image_type: 'EXTERIOR',
        related_type: 'BRANCH',
        related_id: branch2!.id,
        image_url:
          'https://res.cloudinary.com/dtnnyqa0g/image/upload/v1746729693/exterior_2_s3imyi.webp',
      },
    ];

    for (const imageData of imagesList) {
      const exists = await imagesRepository.findOne({
        where: { id: imageData.id },
      });
      if (exists) {
        exists.image_type = imageData.image_type;
        exists.related_type = imageData.related_type;
        exists.related_id = imageData.related_id;
        exists.image_url = imageData.image_url;
        await imagesRepository.save(exists);
      } else {
        const newImage = imagesRepository.create(imageData);
        await imagesRepository.save(newImage);
      }
    }

    console.log('✅ Images seeders inserted successfully!');
  } catch (error) {
    console.error('❌ Error inserting images seeders:', error);
  }
};
