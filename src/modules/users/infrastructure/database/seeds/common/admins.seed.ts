import { DataSource } from 'typeorm';
import { AdministratorEntity } from '../../../entities/admin.entity';
import { PeopleEntity } from '../../../entities/people.entity';
import { StoreEntity } from 'src/modules/stores/infrastructure/entities/store.entity';
import { BranchesEntity } from 'src/modules/stores/infrastructure/entities/branches.entity';

export const seedAdmins = async (dataSource: DataSource) => {
  try {
    const adminsRepository = dataSource.getRepository(AdministratorEntity);
    const peopleRepository = dataSource.getRepository(PeopleEntity);
    const storeRepository = dataSource.getRepository(StoreEntity);
    const branchRepository = dataSource.getRepository(BranchesEntity);

    const store = await storeRepository.findOne({ where: { id: 1 } });
    const branch = await branchRepository.findOne({ where: { id: 1 } });

    const adminData = [
      {
        person: await peopleRepository.findOne({ where: { id: 1 } }),
        admin_type: 'SYSTEM' as const,
        entity_id: null,
      },
      {
        person: await peopleRepository.findOne({ where: { id: 2 } }),
        admin_type: 'STORE' as const,
        entity_id: store!.id,
      },
      {
        person: await peopleRepository.findOne({ where: { id: 3 } }),
        admin_type: 'BRANCH' as const,
        entity_id: branch!.id,
      },
    ];

    for (const data of adminData) {
      if (!data.person) {
        console.warn('⚠️ No person found for administrator, skipping...');
        continue;
      }

      const existingAdmin = await adminsRepository.findOne({
        where: { person: { id: data.person.id } },
        relations: ['person'],
      });

      if (existingAdmin) {
        existingAdmin.admin_type = data.admin_type;
        existingAdmin.entity_id = data.entity_id || undefined;

        await adminsRepository.save(existingAdmin);
      } else {
        const newAdmin = adminsRepository.create({
          person: data.person!,
          admin_type: data.admin_type,
          entity_id: data.entity_id || undefined,
        });
        await adminsRepository.save(newAdmin);
      }
    }
    console.log('✅ Admins seeders inserted successfully.');
  } catch (error) {
    console.error('❌ Error inserting admins seeders:', error);
  }
};
