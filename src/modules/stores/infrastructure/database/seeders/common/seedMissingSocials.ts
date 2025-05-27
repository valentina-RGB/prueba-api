import { DataSource } from 'typeorm';
import { BranchesEntity } from '../../../entities/branches.entity';
import { SocialBranchEntity } from '../../../entities/social-branch.entity';
import { SocialNetworkEntity } from '../../../entities/social-network.entity';

export const fixBranchesWithDefaultEmailSocial = async (
  dataSource: DataSource,
) => {
  const branchRepo = dataSource.getRepository(BranchesEntity);
  const socialBranchRepo = dataSource.getRepository(SocialBranchEntity);

  const socialNetworkRepo = dataSource.getRepository(SocialNetworkEntity);
  const emailSocialNetwork = await socialNetworkRepo.findOne({
    where: { name: 'Email' },
  });

  if (!emailSocialNetwork) {
    console.error('❌ Social network "Email" not found.');
  }

  const branchesWithoutSocials = await branchRepo
    .createQueryBuilder('branch')
    .leftJoinAndSelect(
      'branch.store',
      'branch.social_branches',
      'social_branches',
    )
    .where('social_branches.id IS NULL')
    .getMany();

  for (const branch of branchesWithoutSocials) {
    const email = branch.store.email;

    if (emailSocialNetwork) {
      const social = socialBranchRepo.create({
        branch: branch!,
        social_network: emailSocialNetwork!,
        value: email,
        description: 'Correo de contacto oficial',
      });

      await socialBranchRepo.save(social);
    }
  }

  console.log(
    `✅ Email-type social network were added to ${branchesWithoutSocials.length} branches.`,
  );
};
