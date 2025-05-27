import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICriteriaRepository } from '../../domain/repositories/criteria.repository.interface';
import { CriteriaEntity } from '../entities/criteria.entity';

@Injectable()
export class CriteriaRepository implements ICriteriaRepository {
  constructor(
    @InjectRepository(CriteriaEntity)
    private readonly criteriaEntityRepository: Repository<CriteriaEntity>,
  ) {}

  async findById(id: number): Promise<CriteriaEntity | null> {
    return await this.criteriaEntityRepository.findOne({
      where: { id },
    });
  }
  async findAllByStatus(status: boolean): Promise<CriteriaEntity[]> {
    return await this.criteriaEntityRepository.find({
      where: { active: status },
    });
  }
}
