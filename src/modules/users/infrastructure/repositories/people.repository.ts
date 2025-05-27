import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { PeopleEntity } from '../entities/people.entity';
import { IPeopleRepository } from '../../domain/repositories/people.repository.interface';
import { IPeople } from '../../domain/models/people.interface';
import {
  IPersonCreateDto,
  IPersonUpdateDto,
} from '../../domain/dto/person.dto.interface';

@Injectable()
export class PeopleRepository implements IPeopleRepository {
  constructor(
    @InjectRepository(PeopleEntity)
    private readonly peopleEntityRepository: Repository<PeopleEntity>,
  ) {}
  async createPeople(personData: IPersonCreateDto): Promise<IPeople> {
    try {
      return await this.peopleEntityRepository.save(
        personData as DeepPartial<PeopleEntity>,
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to create person');
    }
  }
  async updatePeople(id: number, PersonData: IPersonUpdateDto): Promise<void> {
    try {
      await this.peopleEntityRepository.update(id, PersonData);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update person');
    }
  }
  async findById(id: number): Promise<IPeople | null> {
    return await this.peopleEntityRepository.findOne({
      where: { id },
      relations: ['user', 'user.role'],
    });
  }
  async findAll(): Promise<IPeople[]> {
    return await this.peopleEntityRepository.find({
      relations: ['user', 'user.role'],
    });
  }

  async findByIdentification(number_document: string): Promise<IPeople | null> {
    return await this.peopleEntityRepository.findOne({
      where: { number_document }
    });
  }

  withTransaction(manager: EntityManager): IPeopleRepository {
    return new PeopleRepository(manager.getRepository(PeopleEntity));
  }
}
