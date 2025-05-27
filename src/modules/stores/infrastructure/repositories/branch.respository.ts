import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { IBranchesRepository } from 'src/modules/stores/domain/repositories/branches.repository.interface';
import { IBranches } from '../../domain/models/branches.interface';
import { BranchesEntity } from '../entities/branches.entity';
import {
  IBranchesCreateDto,
  IBranchesUpdateDto,
} from '../../domain/dto/branch.interface.dto';

@Injectable()
export class BranchRepository implements IBranchesRepository {
  constructor(
    @InjectRepository(BranchesEntity)
    private readonly branchEntityRepository: Repository<BranchesEntity>,
  ) {}
  async createBranch(
    branch: IBranchesCreateDto,
    manager?: EntityManager,
  ): Promise<IBranches> {
    try {
      if (manager) {
        return await manager.save(BranchesEntity, branch);
      }
      return await this.branchEntityRepository.save(branch);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create branch');
    }
  }

  async findById(id: number): Promise<IBranches | null> {
    return await this.branchEntityRepository.findOne({
      where: { id },
      relations: ['store', 'social_branches', 'social_branches.social_network'],
    });
  }

  async findByStatus(status: string): Promise<IBranches[]> {
    return await this.branchEntityRepository.find({
      where: { status },
      relations: ['store'],
    });
  }

  async findAll(): Promise<BranchesEntity[]> {
    return await this.branchEntityRepository.find({
      relations: ['store', 'social_branches', 'social_branches.social_network'],
    });
  }

  async getAllSortedByProximity(
  lat: number,
  long: number,
): Promise<IBranches[] | null> {
  try {
    return await this.branchEntityRepository
      .createQueryBuilder('branch')
      .leftJoinAndSelect('branch.store', 'store')
      .leftJoinAndSelect('branch.social_branches', 'social_branches')
      .leftJoinAndSelect('social_branches.social_network', 'social_network')
      .addSelect(`
        (
          6371 * acos(
            cos(radians(:lat)) *
            cos(radians(branch.latitude)) *
            cos(radians(branch.longitude) - radians(:long)) +
            sin(radians(:lat)) *
            sin(radians(branch.latitude))
          )
        )
      `, 'distance')
      .setParameters({ lat, long })
      .orderBy('distance', 'ASC')
      .getMany();
  } catch (error) {
    throw new InternalServerErrorException(
      'Failed to get branches sorted by proximity',
      error.message,
    );
  }
}

  async findByStoreId(store_id: number): Promise<IBranches[]> {
    try {
      return await this.branchEntityRepository.find({
        where: { store: { id: store_id } },
        relations: [
          'store',
          'social_branches',
          'social_branches.social_network',
        ],
        order: {
          id: 'ASC',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to find branches for store ${store_id}`,
        error.message,
      );
    }
  }

  async update(id: number, data: IBranchesUpdateDto): Promise<IBranches> {
    await this.branchEntityRepository.save({ ...data, id });

    const updatedBranch = await this.findById(id);
    if (!updatedBranch)
      throw new InternalServerErrorException('Failed to find updated branch');

    return updatedBranch;
  }

  async openOrCloseBranch(branch: IBranches): Promise<IBranches> {
    try {
      return await this.branchEntityRepository.save(branch);
    } catch (error) {
      throw new InternalServerErrorException('Failed to open or close branch');
    }
  }
}
