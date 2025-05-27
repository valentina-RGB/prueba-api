import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IAdminCreateDto } from '../../domain/dto/admin.dto.interface';
import { IAdministrator } from '../../domain/models/admin.interface';
import { IAdminRepository } from '../../domain/repositories/admin.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { AdministratorEntity } from '../entities/admin.entity';
import { DeepPartial, EntityManager, Repository } from 'typeorm';

@Injectable()
export class AdminRepository implements IAdminRepository {
  constructor(
    @InjectRepository(AdministratorEntity)
    private readonly adminEntityRepository: Repository<AdministratorEntity>,
  ) {}

  async create(data: IAdminCreateDto): Promise<IAdministrator> {
    try {
      const adminEntity = this.adminEntityRepository.create(
        data as DeepPartial<AdministratorEntity>,
      );
      return await this.adminEntityRepository.save(adminEntity);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Administrator already exists');
      }
      throw new InternalServerErrorException('Failed to create admin');
    }
  }

  async findById(id: number): Promise<IAdministrator | null> {
    const admin = await this.adminEntityRepository.findOne({
      where: { id },
      relations: ['store', 'branch', 'person', 'person.user'],
    });
    if (admin) {
      if (admin.admin_type === 'STORE') {
        admin.branch = undefined;
      } else if (admin.admin_type === 'BRANCH') {
        admin.store = undefined;
      }
    }
    return admin;
  }

    async findByUserId(userId: number): Promise<IAdministrator | null> {
      return await this.adminEntityRepository.findOne({
        where: { person: { user: { id: userId } } },
        relations: ['person', 'person.user'],
      });
    }

  async findAll(): Promise<IAdministrator[]> {
    const admins = await this.adminEntityRepository.find({
      relations: ['store', 'branch', 'person', 'person.user'],
    });

    return admins.map((admin) => {
      if (admin.admin_type === 'STORE') {
        admin.branch = undefined;
      } else if (admin.admin_type === 'BRANCH') {
        admin.store = undefined;
      }
      return admin;
    });
  }

  async findOne(options: any): Promise<IAdministrator | null> {
    return await this.adminEntityRepository.findOne(options);
  }

  withTransaction(manager: EntityManager): AdminRepository {
    const transactionalRepo = new AdminRepository(manager.getRepository(AdministratorEntity));
    return transactionalRepo;
  }
}
