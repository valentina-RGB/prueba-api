import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBranchAttribute } from '../../domain/models/branch-attribute.interface';
import { BranchAttributeEntity } from '../entities/branches-attributes.entity';
import { IBranchAttributeRepository } from '../../domain/repositories/branch-attributes.repository.interface';
import {
  ICreateBranchAttribute,
  IUpdateBranchAttribute,
} from '../../domain/dto/branches-attributes.interface.dto';
import { error } from 'console';

@Injectable()
export class BranchAttributeRepository implements IBranchAttributeRepository {
  constructor(
    @InjectRepository(BranchAttributeEntity)
    private readonly branchAttributeEntity: Repository<BranchAttributeEntity>,
  ) {}

  async create(
    branchAttribute: ICreateBranchAttribute,
  ): Promise<IBranchAttribute> {
    try {
      return await this.branchAttributeEntity.save(branchAttribute);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'One or more branch attributes already exist',
        );
      }
      throw new InternalServerErrorException(
        'Failed to create branch attribute',
      );
    }
  }

  async findById(id: number): Promise<IBranchAttribute | null> {
    return await this.branchAttributeEntity.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<IBranchAttribute[]> {
    return await this.branchAttributeEntity.find();
  }

  async findAllByBranch(branchId: number): Promise<IBranchAttribute[]> {
    return await this.branchAttributeEntity.find({
      where: { branch: { id: branchId } },
    });
  }

  async findByBranchAndAttribute(
    branchId: number,
    attributeId: number,
  ): Promise<IBranchAttribute | null> {
    return await this.branchAttributeEntity.findOne({
      where: {
        branch: { id: branchId },
        attribute: { id: attributeId },
      },
    });
  }

  async update(data: IBranchAttribute): Promise<IBranchAttribute> {
    try {
      const updatedBranchAttribute =
        await this.branchAttributeEntity.save(data);
      if (!updatedBranchAttribute) {
        throw new InternalServerErrorException(
          'Failed to update branch attribute',
        );
      }
      return updatedBranchAttribute;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update branch attribute: ${error.message}`,
      );
    }
  }
}
