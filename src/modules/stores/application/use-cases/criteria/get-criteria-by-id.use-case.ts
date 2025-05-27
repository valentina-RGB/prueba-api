import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { ICriteria } from 'src/modules/stores/domain/models/criteria.interface';
import {
  ICriteriaRepository,
  ICriteriaRepositoryToken,
} from 'src/modules/stores/domain/repositories/criteria.repository.interface';

@Injectable()
export class GetCriteriaUseCase implements IUseCase<number, ICriteria | null> {
  constructor(
    @Inject(ICriteriaRepositoryToken)
    private readonly criteriaRepository: ICriteriaRepository,
  ) {}

  async execute(id: number): Promise<ICriteria | null> {
    const criteria = await this.criteriaRepository.findById(id);
    if (!criteria) {
      throw new NotFoundException('Criteria not found');
    }
    return criteria;
  }
}
