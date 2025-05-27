import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IBranches } from '../../../domain/models/branches.interface';
import {
  IBranchRepositoryToken,
  IBranchesRepository,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';

@Injectable()
export class ListBranchUseCase
  implements IUseCase<{ lat?: number; long?: number }, IBranches[]>
{
  constructor(
    @Inject(IBranchRepositoryToken)
    private readonly branchRepository: IBranchesRepository,
  ) {}

  async execute({
    lat,
    long,
  }: {
    lat?: number;
    long?: number;
  }): Promise<IBranches[]> {
    if (lat && long) {
      const branches = await this.branchRepository.getAllSortedByProximity(lat, long);
      if (!branches)
        throw new InternalServerErrorException('Error fetching branches by proximity');
      return branches;
    }
    return await this.branchRepository.findAll();
  }
}
