import { DataSource } from 'typeorm';
import { StoreEntity } from '../../../entities/store.entity';

export const seedStores = async (dataSource: DataSource) => {
  try {
    const storeRepository = dataSource.getRepository(StoreEntity);

    const stores = [
      {
        id: 1,
        name: 'Encafeinados',
        type_document: 'NIT',
        number_document: '987654321-1',
        logo: 'https://res.cloudinary.com/dtnnyqa0g/image/upload/v1743630974/images-coffee/Captura%20de%20pantalla%202025-03-20%20184844.png.png',
        phone_number: '1234555667',
        email: 'contacto@encafeinadosv2.com',
        status: 'APPROVED',
      },
      {
        id: 2,
        name: 'Aroma Montaña',
        type_document: 'NIT',
        number_document: '765432109-3',
        logo: 'https://res.cloudinary.com/dtnnyqa0g/image/upload/v1743789558/images-coffee/Captura%20de%20pantalla%202025-03-20%20185207.png.png',
        phone_number: '3114567890',
        email: 'ventas@aromamontana.com',
        status: 'APPROVED',
      },
    ];

    for (const store of stores) {
      const exists = await storeRepository.findOne({
        where: { number_document: store.number_document },
      });
      if (exists) {
        exists.id = store.id;
        exists.name = store.name;
        exists.type_document = store.type_document;
        exists.number_document = store.number_document;
        exists.logo = store.logo;
        exists.phone_number = store.phone_number;
        exists.email = store.email;
        exists.status = store.status;

        await storeRepository.save(exists);
      } else {
        const newStore = storeRepository.create(store);
        await storeRepository.save(newStore);
      }
    }

    console.log('✅ Store seeders inserted successfully.');
  } catch (error) {
    console.error('❌ Error inserting store seeders:', error);
  }
};
