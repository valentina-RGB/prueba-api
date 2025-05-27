import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../entities/user.entity';
import { IUser } from 'src/modules/users/domain/models/user.interface';
import {
  IUserCreateDto,
  IUserUpdateDto,
} from '../../domain/dto/user.dto.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  async findById(id: number): Promise<IUser | null> {
    return this.userEntityRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async create(user: IUserCreateDto): Promise<IUser> {
    try {
      return await this.userEntityRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userEntityRepository.findOne({
      where: { email },
      relations: ['role', 'person', 'person.administrator', 'person.administrator.store', 'person.administrator.branch'],
    });
  }

  async findAll(): Promise<IUser[]> {
    return this.userEntityRepository.find({
      relations: ['role', 'person']
    });
  }

  async update(id: number, userData: IUserUpdateDto): Promise<void> {
    try {
      const updateData = userData.role_id
        ? {
            ...userData,
            role: { id: userData.role_id },
          }
        : userData;

      if ('role_id' in updateData) delete updateData.role_id;

      await this.userEntityRepository.update(id, updateData);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async delete(id: number): Promise<void> {
    await this.userEntityRepository.delete(id);
  }

  withTransaction(manager: EntityManager): IUserRepository {
    return new UserRepository(manager.getRepository(UserEntity));
  }
}
