import { AdministratorEntity } from 'src/modules/users/infrastructure/entities/admin.entity';
import { DataSource } from 'typeorm';
import { BranchesEntity } from '../../../entities/branches.entity';
import { BranchApprovalEntity } from '../../../entities/branch-approval.entity';

export const seedBranchApproval= async (dataSource: DataSource) => {
  try {
    const branchRepository = dataSource.getRepository(BranchesEntity);
    const adminRepository = dataSource.getRepository(AdministratorEntity);
    const branchApprovalRepository = dataSource.getRepository(BranchApprovalEntity);

    const branchApporvalList = [
      {
        id: 1,
        status: 'APPROVED',
        branch: await branchRepository.findOne({ where: { id: 1 } }),
        approved_by: await adminRepository.findOne({ where: { id: 1 } }),
      },
      {
        id: 2,
        status: 'APPROVED',
        branch: await branchRepository.findOne({ where: { id: 2 } }),
        approved_by: await adminRepository.findOne({ where: { id: 1 } }),
      },
      {
        id: 3,
        status: 'PENDING',
        branch: await branchRepository.findOne({ where: { id: 3 } }),
        approved_by: null,
      },
    ];

    for (const approval of branchApporvalList) {
      if (!approval.branch) {
        console.warn('⚠️ Branch not found, skipping...');
        continue;
      }

      const exists = await branchApprovalRepository.findOne({
        where: { branch: { id: approval.branch.id } },
        relations: ['branch'],
      });

      if (exists) {
        exists.id = approval.id;
        exists.status = approval.status;
        exists.approved_by = approval.approved_by! || undefined;
        await branchApprovalRepository.save(exists);
      } else {
        const newApproval = branchApprovalRepository.create({
          id: approval.id,
          status: approval.status,
          branch: approval.branch,
          approved_by: approval.approved_by || undefined,
        });
        await branchApprovalRepository.save(newApproval);
      }
    }

    console.log('✅ Branch approval seeders inserted successfully.');
  } catch (error) {
    console.error('❌ Error inserting approval-branches seeders:', error);
  }
};
