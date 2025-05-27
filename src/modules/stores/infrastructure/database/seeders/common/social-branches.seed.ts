import { DataSource } from 'typeorm';
import { SocialNetworkEntity } from '../../../entities/social-network.entity';
import { BranchesEntity } from '../../../entities/branches.entity';
import { SocialBranchEntity } from '../../../entities/social-branch.entity';

export const seedSocialBranches = async (dataSource: DataSource) => {
  try {
    const branchRepository = dataSource.getRepository(BranchesEntity);
    const socialNetworkRepository =
      dataSource.getRepository(SocialNetworkEntity);
    const socialBranchRepository = dataSource.getRepository(SocialBranchEntity);

    const socialBranchesList = [
      {
        id: 1,
        social_network: await socialNetworkRepository.findOne({
          where: { id: 1 },
        }),
        branch: await branchRepository.findOne({ where: { id: 1 } }),
        value: 'https://facebook.com/zentea.poblado',
        description: 'Facebook oficial',
      },
      {
        id: 2,
        social_network: await socialNetworkRepository.findOne({
          where: { id: 2 },
        }),
        branch: await branchRepository.findOne({ where: { id: 1 } }),
        value: 'https://instagram.com/zentea.poblado',
        description: 'Instagram oficial',
      },
      {
        id: 3,
        social_network: await socialNetworkRepository.findOne({
          where: { id: 1 },
        }),
        branch: await branchRepository.findOne({ where: { id: 2 } }),
        value: 'https://facebook.com/encafeinados.sabaneta',
        description: 'Facebook oficial',
      },
      {
        id: 4,
        social_network: await socialNetworkRepository.findOne({
          where: { id: 1 },
        }),
        branch: await branchRepository.findOne({ where: { id: 3 } }),
        value: 'https://facebook.com/coffeehouse.centro',
        description: 'Facebook oficial',
      },
    ];

    for (const socialBranch of socialBranchesList) {
      if (!socialBranch.branch || !socialBranch.social_network) {
        console.warn('⚠️ Missing branch or social network, skipping...');
        continue;
      }

      const exists = await socialBranchRepository.findOne({
        where: {
          branch: { id: socialBranch.branch.id },
          social_network: { id: socialBranch.social_network.id },
        },
        relations: ['branch', 'social_network'],
      });

      if (exists) {
        exists.id = socialBranch.id;
        exists.value = socialBranch.value;
        exists.description = socialBranch.description;
        await socialBranchRepository.save(exists);
      } else {
        const newSocialBranch = socialBranchRepository.create({
          social_network: socialBranch.social_network!,
          branch: socialBranch.branch!,
          value: socialBranch.value,
          description: socialBranch.description,
        });
        await socialBranchRepository.save(newSocialBranch);
      }
    }
  } catch (error) {
    console.error('❌ Error inserting social-branches seeders:', error);
  }
};
