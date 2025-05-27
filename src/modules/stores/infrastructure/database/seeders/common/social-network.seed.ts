import { DataSource } from 'typeorm';
import { SocialNetworkEntity } from '../../../entities/social-network.entity';

export const seedSocialNetworks = async (dataSource: DataSource) => {
  try {
    const socialNetworkRepository =
      dataSource.getRepository(SocialNetworkEntity);

    const socialNetworks = [
      { id: 1, name: 'Facebook' },
      { id: 2, name: 'Instagram' },
      { id: 3, name: 'X-Twitter' },
      { id: 4, name: 'WhatsApp' },
      { id: 5, name: 'Email' },
      { id: 6, name: 'TikTok' },
    ];

    for (const sn of socialNetworks) {
      const exists = await socialNetworkRepository.findOne({
        where: { name: sn.name },
      });
      if (!exists) {
        await socialNetworkRepository.insert(sn);
      }
    }

    console.log('✅ Social network seeders inserted successfully.');
  } catch (error) {
    console.error('❌ Error inserting social network seeders:', error);
  }
};
