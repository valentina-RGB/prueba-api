import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICriteriaResponseRepository } from '../../domain/repositories/criteria-response.repository.interface';
import { CriteriaResponseEntity } from '../entities/criteria-response.entity';
import { ICreateCriteriaResponseDto } from '../../domain/dto/criteria.interface.dto';
import { ICriteriaResponse } from '../../domain/models/criteria-response.interface';

@Injectable()
export class CriteriaResponseRepository implements ICriteriaResponseRepository {
  constructor(
    @InjectRepository(CriteriaResponseEntity)
    private readonly criteriaEntityRepository: Repository<CriteriaResponseEntity>,
  ) {}

  async createMany(
    responses: ICreateCriteriaResponseDto[],
  ): Promise<ICriteriaResponse[]> {
    return await this.criteriaEntityRepository.save(responses);
  }
}
