import { DataSource } from 'typeorm';
import { AppDataSource } from '../../../config/data-source';
import { seedUsers } from '../../../modules/users/infrastructure/database/seeds/common/users.seed';
import { seedRoles } from 'src/modules/users/infrastructure/database/seeds/common/roles.seed';

import { seedPeople } from 'src/modules/users/infrastructure/database/seeds/common/people.seed';
import { seedClients } from 'src/modules/users/infrastructure/database/seeds/common/clients.seed';
import { seedStores } from 'src/modules/stores/infrastructure/database/seeders/common/store.seed';
import { seedBranches } from 'src/modules/stores/infrastructure/database/seeders/common/branch.seed';
import { seedAdmins } from 'src/modules/users/infrastructure/database/seeds/common/admins.seed';
import { seedCriteria } from 'src/modules/stores/infrastructure/database/seeders/common/criteria.seed';
import { seedSocialNetworks } from 'src/modules/stores/infrastructure/database/seeders/common/social-network.seed';
import { seedSocialBranches } from 'src/modules/stores/infrastructure/database/seeders/common/social-branches.seed';
import { seedBranchApproval } from 'src/modules/stores/infrastructure/database/seeders/common/branch-approval.seed';
import { seedCriteriaResponse } from 'src/modules/stores/infrastructure/database/seeders/common/criteria-response.seed';
import { seedAlbums } from 'src/modules/albums/infrastructure/database/seeders/album.seeder';
import { seedPages } from 'src/modules/albums/infrastructure/database/seeders/page.seeder';
import { seedStamps } from 'src/modules/albums/infrastructure/database/seeders/stamp.seeder';
import { seedPagesStamps } from 'src/modules/albums/infrastructure/database/seeders/page-stamp.seeder';
import { seedImagesBranch } from 'src/modules/stores/infrastructure/database/seeders/common/images.seed';
import { seedAttributes } from 'src/modules/stores/infrastructure/database/seeders/common/attributes.seed';

const seedDatabase = async (dataSource: DataSource) => {
  console.log('🌱 Ejecuting seeds...');

  const environment = process.env.NODE_ENV || 'development';

  if (environment === 'development' || environment === 'test') {
    console.log('🔧 Executing seeds for development/testing');
    await seedRoles(dataSource);
    await seedUsers(dataSource);
    await seedPeople(dataSource);
    await seedClients(dataSource);
    await seedStores(dataSource);
    await seedSocialNetworks(dataSource);
    await seedBranches(dataSource);
    await seedSocialBranches(dataSource);
    await seedAdmins(dataSource);
    await seedCriteria(dataSource);
    await seedBranchApproval(dataSource);
    await seedCriteriaResponse(dataSource);
    await seedAlbums(dataSource);
    await seedPages(dataSource);
    await seedStamps(dataSource);
    await seedPagesStamps(dataSource);
    await seedImagesBranch(dataSource);
    await seedAttributes(dataSource);
  }

  if (environment === 'production') {
    console.log('🚀 Executing seeds for prod...');
    await seedRoles(dataSource);
    await seedUsers(dataSource);
    await seedPeople(dataSource);
    await seedClients(dataSource);
    await seedStores(dataSource);
    await seedSocialNetworks(dataSource);
    await seedBranches(dataSource);
    await seedSocialBranches(dataSource);
    await seedAdmins(dataSource);
    await seedCriteria(dataSource);
    await seedBranchApproval(dataSource);
    await seedCriteriaResponse(dataSource);
    await seedAlbums(dataSource);
    await seedPages(dataSource);
    await seedStamps(dataSource);
    await seedPagesStamps(dataSource);
    await seedImagesBranch(dataSource);
    await seedAttributes(dataSource);
  }

  console.log('✅ Seeds completed');
};

AppDataSource.initialize()
  .then(async (dataSource) => {
    await seedDatabase(dataSource);
    await AppDataSource.destroy();
  })
  .catch((error) => console.error('❌ Error executing seeds:', error));
