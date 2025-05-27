import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ICreatePageStampsDto,
  IUpdatePageStampsDto,
} from '../../domain/dto/page-stamp.dto.interface';
import { IPageStamps } from '../../domain/models/page-stamps.interface';
import { IPageStampsRepository } from '../../domain/repositories/page-stamp.repository.interface';
import { PageStampsEntity } from '../entities/page-stamps.entity';

export class PageStampsRepository implements IPageStampsRepository {
  constructor(
    @InjectRepository(PageStampsEntity)
    private readonly pageStampsRepository: Repository<PageStampsEntity>,
  ) {}

  async create(data: ICreatePageStampsDto): Promise<IPageStamps> {
     const pageStamp = this.pageStampsRepository.create(data);
     return await this.pageStampsRepository.save(pageStamp);
  }

  findAll(): Promise<IPageStamps[]> {
    return this.pageStampsRepository.find();
  }

  findStampsByPage(id: number): Promise<IPageStamps[] | null> {
    return this.pageStampsRepository.find({
      where: { page: { id } },
      relations: ['page', 'stamp'],
    });
  }
  update(id: number, data: IUpdatePageStampsDto): Promise<IPageStamps | null> {
    return this.pageStampsRepository.save({ id, ...data });
  }
}
