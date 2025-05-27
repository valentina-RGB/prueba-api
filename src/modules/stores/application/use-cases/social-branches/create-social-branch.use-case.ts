import { ISocialBranch } from 'src/modules/stores/domain/models/social-branch.interface';
import {
  ISocialBranchRepository,
  ISocialBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/social-branch.repository.interface';
import { ConflictException, Inject } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { CreateSocialBranchObjetsDto } from '../../dto/social-branch/create-social-branch.dto';
import { EntityManager } from 'typeorm';

export class CreateSocialBranchUseCase
  implements IUseCase<CreateSocialBranchObjetsDto, ISocialBranch>
{
  constructor(
    @Inject(ISocialBranchRepositoryToken)
    private readonly socialRepository: ISocialBranchRepository,
  ) {}

  async execute(
    socialData: CreateSocialBranchObjetsDto,
    manager: EntityManager,
  ): Promise<ISocialBranch> {
    try {
      const newSocialBranch = await this.socialRepository.create(
        socialData,
        manager,
      );
      return newSocialBranch;
    } catch (error) {
      throw new ConflictException('Failed to create social branch');
    }
  }
}
