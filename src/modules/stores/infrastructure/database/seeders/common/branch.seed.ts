import { DataSource } from 'typeorm';
import { BranchesEntity } from '../../../entities/branches.entity';
import { StoreEntity } from '../../../entities/store.entity';

export const seedBranches = async (dataSource: DataSource) => {
  try {
    const branchRepository = dataSource.getRepository(BranchesEntity);
    const storeRepository = dataSource.getRepository(StoreEntity);

    const branchesList = [
      {
        id: 1,
        store: await storeRepository.findOne({ where: { id: 1 } }),
        name: 'Zentea - Poblado',
        phone_number: '123456789',
        latitude: 6.210296692451014,
        longitude: -75.57019634515639,
        address:
          'Calle 10 #42-45, Plazoleta Principal Poblado, Medellín - Colombia',
        average_rating: 4.5,
        status: 'APPROVED',
      },
      {
        id: 2,
        store: await storeRepository.findOne({ where: { id: 1 } }),
        name: 'Encafeinados - Sabaneta',
        phone_number: '123456777',
        latitude: 6.138320951057647,
        longitude: -75.610238099235,
        address: 'Carrera 30 #68sur-185 La Doctora, Sabaneta - Colombia',
        average_rating: 4.8,
        status: 'APPROVED',
      },
      {
        id: 3,
        store: await storeRepository.findOne({ where: { id: 2 } }),
        name: 'Coffee House - Centro',
        phone_number: '3012345678',
        latitude: 6.2518,
        longitude: -75.5636,
        address: 'Carrera 50 #45-12, Centro, Medellín - Colombia',
        average_rating: 4.3,
        status: 'PENDING',
      },
    ];

    for (const branchData of branchesList) {
      const exists = await branchRepository.findOne({
        where: { name: branchData.name },
      });
      if (exists) {
        exists.id = branchData.id;
        exists.store = branchData.store!;
        exists.phone_number = branchData.phone_number;
        exists.latitude = branchData.latitude;
        exists.longitude = branchData.longitude;
        exists.address = branchData.address;
        exists.average_rating = branchData.average_rating;
        exists.status = branchData.status;

        await branchRepository.save(exists);
      } else {
        if (branchData.store) {
          const newBranch = branchRepository.create({
            ...branchData,
            store: branchData.store,
          });
          await branchRepository.save(newBranch);
        }
      }
    }

    console.log('✅ Branch seeders inserted successfully.');
  } catch (error) {
    console.error('❌ Error inserting branch seeders:', error);
  }
};
