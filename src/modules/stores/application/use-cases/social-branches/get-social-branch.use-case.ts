import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { ISocialBranch } from 'src/modules/stores/domain/models/social-branch.interface';
import {
  ISocialBranchRepository,
  ISocialBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/social-branch.repository.interface';

@Injectable()
export class GetSocialBranchUseCase
  implements IUseCase<number, ISocialBranch | null>
{
  constructor(
    @Inject(ISocialBranchRepositoryToken)
    private readonly socialRepository: ISocialBranchRepository,
  ) {}

  async execute(id: number): Promise<ISocialBranch | null> {
    const socialBranch = await this.socialRepository.findById(id);
    if (!socialBranch) {
      throw new NotFoundException('Social Branch not found');
    }
    return socialBranch;
  }
}
