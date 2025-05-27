import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ICreateAttribute,
  IUpdateAttribute,
} from '../../domain/dto/attributes.interface.dto';
import { IAttribute } from '../../domain/models/attributes.interface';
import { IAttributeRepository } from '../../domain/repositories/attributes.repository.interface';
import { AttributeEntity } from '../entities/attributes.entity';

@Injectable()
export class AttributeRepository implements IAttributeRepository {
  constructor(
    @InjectRepository(AttributeEntity)
    private readonly attributeEntityRepository: Repository<AttributeEntity>,
  ) {}

  async findAll(): Promise<IAttribute[]> {
    return await this.attributeEntityRepository.find();
  }

  async findById(id: number): Promise<IAttribute | null> {
    return await this.attributeEntityRepository.findOne({ where: { id } });
  }

  async create(attributeData: ICreateAttribute): Promise<IAttribute> {
    return await this.attributeEntityRepository.save(attributeData);
  }

  async update(id: number, data: IUpdateAttribute): Promise<IAttribute> {
    await this.attributeEntityRepository.update(id, data);

    const attribute = await this.findById(id);
    if (!attribute) throw new Error('Attribute not found');

    return attribute;
  }
}

