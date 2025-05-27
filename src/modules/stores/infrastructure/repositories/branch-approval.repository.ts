import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { IBranchApprovalRepository } from '../../domain/repositories/branch-approval.repository.interface';
import { BranchApprovalEntity } from '../entities/branch-approval.entity';
import { IBranchApproval } from '../../domain/models/branch-approval.interface';
import {
  ICreateBranchApprovalDto,
  IUpdateBranchApprovalStatusDto,
} from '../../domain/dto/branch-approval.interface.dto';

@Injectable()
export class BranchApprovalRepository implements IBranchApprovalRepository {
  constructor(
    @InjectRepository(BranchApprovalEntity)
    private readonly branchApprovalEntityRepository: Repository<BranchApprovalEntity>,
  ) {}
  async findById(id: number): Promise<IBranchApproval | null> {
    return await this.branchApprovalEntityRepository.findOne({
      where: { id },
      relations: [
        'branch',
        'branch.store',
        'approved_by',
        'approved_by.person',
        'approved_by.person.user',
      ],
    });
  }

  async create(data: ICreateBranchApprovalDto): Promise<IBranchApproval> {
    return await this.branchApprovalEntityRepository.save(data);
  }

  async update(
    id: number,
    data: IUpdateBranchApprovalStatusDto,
    manager?: EntityManager,
  ): Promise<IBranchApproval> {
    try {
      if (manager) {
        return await manager.save(BranchApprovalEntity, { ...data, id });
      }
      await this.branchApprovalEntityRepository.save({ ...data, id });
      const updatedBranchApproval = await this.findById(id);
      if (!updatedBranchApproval) {
        throw new InternalServerErrorException(
          'Branch approval not found after update',
        );
      }
      return updatedBranchApproval;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update branch approval',
      );
    }
  }

  async findLatestByBranch(branchId: number): Promise<IBranchApproval | null> {
    return this.branchApprovalEntityRepository.findOne({
      where: { branch: { id: branchId } },
      order: { approval_date: 'DESC' },
      relations: [
        'branch',
        'branch.store',
        'criteria_responses.criteria',
        'approved_by',
        'approved_by.person',
        'approved_by.person.user',
      ],
    });
  }
}
