import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { ICreateCriteriaResponseDto } from 'src/modules/stores/domain/dto/criteria.interface.dto';
import { IBranchApproval } from 'src/modules/stores/domain/models/branch-approval.interface';
import { ICriteriaResponse } from 'src/modules/stores/domain/models/criteria-response.interface';
import {
  ICriteriaResponseRepository,
  ICriteriaResponseRepositoryToken,
} from 'src/modules/stores/domain/repositories/criteria-response.repository.interface';
import { CreateCriteriaResponseDto } from '../../dto/criteria-response/create-criteria-response.dto';
import { GetCriteriaUseCase } from '../criteria/get-criteria-by-id.use-case';
@Injectable()
export class CreateCriteriaResponsesUseCase
  implements
    IUseCase<
      {
        criteriaResponseData: CreateCriteriaResponseDto[];
        approval: IBranchApproval;
      },
      ICriteriaResponse[]
    >
{
  constructor(
    @Inject(ICriteriaResponseRepositoryToken)
    private readonly responseRepo: ICriteriaResponseRepository,
    private readonly getCriteriaUseCase: GetCriteriaUseCase,
  ) {}

  async execute({
    criteriaResponseData,
    approval,
  }: {
    criteriaResponseData: CreateCriteriaResponseDto[];
    approval: IBranchApproval;
  }) {
    const responses = await Promise.all(
      criteriaResponseData.map(async (resp) => {
        const criteria = await this.getCriteriaUseCase.execute(resp.criteriaId);
        if (!criteria)
          throw new NotFoundException(`Criteria ${resp.criteriaId} not found`);
        
        return {
          criteria,
          approval,
          response_text: resp.response_text,
          image_url: resp.image_url,
        };
      }),
    );
    return await this.responseRepo.createMany(responses);
  }
}
