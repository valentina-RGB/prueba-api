import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { ISocialBranch } from '../../domain/models/social-branch.interface';
import { ISocialBranchRepository } from '../../domain/repositories/social-branch.repository.interface';
import { SocialBranchEntity } from '../entities/social-branch.entity';
import { ISocialBranchCreateDto } from '../../domain/dto/social-branch.interface.dto';

@Injectable()
export class SocialBranchRepository implements ISocialBranchRepository {
  constructor(
    @InjectRepository(SocialBranchEntity)
    private readonly socialBranchEntity: Repository<SocialBranchEntity>,
  ) {}

  async create(
    socialBranch: ISocialBranchCreateDto,
    manager?: EntityManager,
  ): Promise<ISocialBranch> {
    try {
      if (manager) {
        return await manager.save(
          SocialBranchEntity,
          socialBranch as DeepPartial<SocialBranchEntity>,
        );
      }
      return await this.socialBranchEntity.save(
        socialBranch as DeepPartial<SocialBranchEntity>,
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to create social Network');
    }
  }

  async findById(id: number): Promise<ISocialBranch | null> {
    return await this.socialBranchEntity.findOne({
      where: { id },
      relations: ['branch', 'social_network'],
    });
  }

  async findAll(): Promise<ISocialBranch[]> {
    return await this.socialBranchEntity.find({
      relations: ['branch', 'social_network'],
    });
  }
}
