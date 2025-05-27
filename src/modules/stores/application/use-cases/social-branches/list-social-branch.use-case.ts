import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { ISocialBranch } from 'src/modules/stores/domain/models/social-branch.interface';
import {
  ISocialBranchRepository,
  ISocialBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/social-branch.repository.interface';

@Injectable()
export class ListSocialBranchUseCase
  implements IUseCase<void, ISocialBranch[]>
{
  constructor(
    @Inject(ISocialBranchRepositoryToken)
    private readonly socialRepository: ISocialBranchRepository,
  ) {}

  async execute(): Promise<ISocialBranch[]> {
    return await this.socialRepository.findAll();
  }
}
