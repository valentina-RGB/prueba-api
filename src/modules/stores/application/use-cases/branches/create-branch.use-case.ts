import { Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import {
  IBranchRepositoryToken,
  IBranchesRepository,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';
import { BranchesEntity } from 'src/modules/stores/infrastructure/entities/branches.entity';
import { DataSource, EntityManager } from 'typeorm';
import { CreateBranchDto } from '../../dto/branches/create-branch.dto';
import { CreateSocialBranchUseCase } from '../social-branches/create-social-branch.use-case';
import { GetSocialNetworkUseCase } from '../social-network/get-social-network-use-case';
import { GetStoreUseCase } from '../stores/get-store.use-case';
import { ListBranchUseCase } from './list-branch.use-case';
import { CreateSocialBranchForBranchDto } from '../../dto/social-branch/social-branch-for-branch.dto';
import { ListUserUseCase } from 'src/modules/users/application/use-cases/users/list-user.use-case';
import { SendNewStoreRequestEmailUseCase } from 'src/modules/mailer/application/use-cases/send-new-branch-request.use-case';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { SendBranchProcessNotificationUseCase } from 'src/modules/mailer/application/use-cases/send-branch-process-notification.use-case';

export class CreateBranchUseCase
  implements IUseCase<CreateBranchDto, IBranches>
{
  constructor(
    @Inject(IBranchRepositoryToken)
    private readonly branchRepository: IBranchesRepository,
    private readonly getStoreUseCase: GetStoreUseCase,
    private readonly getBranchesUseCase: ListBranchUseCase,
    private readonly createsocialBranchUseCase: CreateSocialBranchUseCase,
    private readonly getSocialNetworkUseCase: GetSocialNetworkUseCase,

    private readonly listUsersUseCase: ListUserUseCase,
    private readonly sendNewStoreRequestEmailUseCase: SendNewStoreRequestEmailUseCase,
    private readonly sendProcessNotificationEmail: SendBranchProcessNotificationUseCase,
    private readonly dataSource: DataSource,
  ) {}

  async execute(branchData: CreateBranchDto): Promise<IBranches> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const branches = await this.getBranchesUseCase.execute({});
      if (branches.some((b) => b.name === branchData.name)) {
        throw new ConflictException('Branch name already exists');
      }

      const store = await this.getStoreUseCase.execute(branchData.store_id);
      if (!store) throw new NotFoundException('Store not found');

      const newBranch = await this.branchRepository.createBranch(
        { ...branchData, store },
        queryRunner.manager,
      );

      if (branchData.social_branches?.length) {
        await this.createSocialBranches(
          newBranch.id,
          branchData.social_branches,
          queryRunner.manager,
        );
      }

      await this.sendEmailToAdmins(newBranch);
      await this.sendNotificationEmailToStore(newBranch);

      await queryRunner.commitTransaction();
      return newBranch;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async createSocialBranches(
    branchId: number,
    socialBranches: CreateSocialBranchForBranchDto[],
    manager: EntityManager,
  ): Promise<void> {
    for (const socialData of socialBranches) {
      const branch = await manager.findOne(BranchesEntity, {
        where: { id: branchId },
      });

      if (!branch) throw new NotFoundException('Branch not found');

      const socialNetwork = await this.getSocialNetworkUseCase.execute(
        socialData.social_network_id!,
      );

      if (!socialNetwork)
        throw new NotFoundException('Social Network not found');

      const fullSocialData = {
        branch,
        social_network: socialNetwork,
        value: socialData.value,
        description: socialData.description,
      };

      await this.createsocialBranchUseCase.execute(fullSocialData, manager);
    }
  }

  private async sendEmailToAdmins(branchData: IBranches) {
    const admins = (await this.listUsersUseCase.execute()).filter(
      (user) => user.role.name === Role.ADMIN_SYS,
    );

    const adminEmails = admins.map((admin) => admin?.email).filter(Boolean);
    const adminNames = admins
      .map((admin) => admin?.person?.full_name || 'Administrador')
      .filter(Boolean);

    if (adminEmails.length > 0) {
      await this.sendNewStoreRequestEmailUseCase.execute(
        branchData,
        adminEmails,
        adminNames,
      );
    }
  }

  private async sendNotificationEmailToStore(branchData: IBranches) {
    const storeEmail = branchData.store?.email;

    if (storeEmail) {
      await this.sendProcessNotificationEmail.execute(branchData);
    }
  }
}
