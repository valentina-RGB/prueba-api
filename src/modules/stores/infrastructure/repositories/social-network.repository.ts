import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ISocialNetwork } from '../../domain/models/social-network.interface';
import { ISocialNetworkRepository } from '../../domain/repositories/social-network.repository.interface';
import { SocialNetworkEntity } from '../entities/social-network.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISocialNetworkCreateDto } from '../../domain/dto/social-network.interface.dto';

@Injectable()
export class SocialNetworkRepository implements ISocialNetworkRepository {
  constructor(
    @InjectRepository(SocialNetworkEntity)
    private readonly socialNetworkEntity: Repository<SocialNetworkEntity>,
  ) {}

  async create(
    socialNetwork: ISocialNetworkCreateDto,
  ): Promise<ISocialNetwork> {
    try {
      return await this.socialNetworkEntity.save(socialNetwork);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create social Network');
    }
  }

  async findById(id: number): Promise<ISocialNetwork | null> {
    return await this.socialNetworkEntity.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<ISocialNetwork[]> {
    return await this.socialNetworkEntity.find();
  }
}
