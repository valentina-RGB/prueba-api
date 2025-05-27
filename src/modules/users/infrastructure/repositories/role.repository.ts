import { InjectRepository } from '@nestjs/typeorm';
import { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';
import { IRole } from '../../domain/models/role.interface';
import { InternalServerErrorException } from '@nestjs/common';

export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleEntityRepository: Repository<RoleEntity>,
  ) {}

  async create(role: IRole): Promise<IRole> {
    try {
      return await this.roleEntityRepository.save(role);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create role');
    }
  }

  async findById(id: number): Promise<IRole | null> {
    return await this.roleEntityRepository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<IRole | null> {
    return await this.roleEntityRepository.findOne({ where: { name } });
  }

  async findAll(): Promise<IRole[]> {
    return await this.roleEntityRepository.find();
  }

  withTransaction(manager: EntityManager): IRoleRepository {
    return new RoleRepository(manager.getRepository(RoleEntity));
  }
}
