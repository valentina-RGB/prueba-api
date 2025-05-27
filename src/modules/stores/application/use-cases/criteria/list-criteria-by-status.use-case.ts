import { Inject, Injectable} from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { ICriteria } from 'src/modules/stores/domain/models/criteria.interface';
import {
  ICriteriaRepository,
  ICriteriaRepositoryToken,
} from 'src/modules/stores/domain/repositories/criteria.repository.interface';

@Injectable()
export class ListCriteriaByStatusUseCase
  implements IUseCase<boolean, ICriteria[]>
{
  constructor(
    @Inject(ICriteriaRepositoryToken)
    private readonly criteriaRepository: ICriteriaRepository,
  ) {}

  async execute(status: boolean): Promise<ICriteria[]> {
    return await this.criteriaRepository.findAllByStatus(status);
  }
}
