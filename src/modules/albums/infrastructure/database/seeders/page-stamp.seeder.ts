import { DataSource } from 'typeorm';
import { PageStampsEntity } from '../../entities/page-stamps.entity';
import { PageEntity } from '../../entities/page.entity';
import { StampsEntity } from '../../entities/stamps.entity';

export const seedPagesStamps = async (dataSource: DataSource) => {
  try {
    const pageStampRepo = dataSource.getRepository(PageStampsEntity);
    const pageRepo = dataSource.getRepository(PageEntity);
    const stampsRepo = dataSource.getRepository(StampsEntity);

    const pageStamps = [
      {
        page: await pageRepo.findOne({ where: { id: 1 } }),
        stamp: await stampsRepo.findOne({ where: { id: 1 } }),
      },
      {
        page: await pageRepo.findOne({ where: { id: 1 } }),
        stamp: await stampsRepo.findOne({ where: { id: 2 } }),
      },
    ];

    for (const pageStamp of pageStamps) {
      const existingPageStamp = await pageStampRepo.findOne({
        where: { page: pageStamp.page!, stamp: pageStamp.stamp! },
      });

      if (existingPageStamp) {
        existingPageStamp.page = pageStamp.page!;
        existingPageStamp.stamp = pageStamp.stamp!;

        await pageStampRepo.save(existingPageStamp);
      } else {
        const newPageStamp = pageStampRepo.create({
          page: pageStamp.page!,
          stamp: pageStamp.stamp!,
        });

        await pageStampRepo.save(newPageStamp);
      }
    }
    console.log('✅ Pages-Stamps seeders inserted successfully.');
  } catch (error) {
    console.error('❌ Error inserting pages-Stamps seeders:', error);
  }
};
