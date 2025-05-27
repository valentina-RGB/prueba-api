import { InjectRepository } from '@nestjs/typeorm';
import { IPageRepository } from '../../domain/repositories/page.repository.interface';
import { PageEntity } from '../entities/page.entity';
import { Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

export class PageRepository implements IPageRepository {
  constructor(
    @InjectRepository(PageEntity)
    private readonly pageEntityRepository: Repository<PageEntity>,
  ) {}

  create(data: any): Promise<any> {
    try {
      return this.pageEntityRepository.save(data);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Page with this name already exists');
      }
      throw new InternalServerErrorException('Failed to create page');
    }
  }

  findAll(albumId: number): Promise<any[]> {
    return this.pageEntityRepository.find({
      where: { album: { id: albumId } },
      relations: ['album'],
    });
  }

  findById(id: number): Promise<any | null> {
    return this.pageEntityRepository.findOne({
      where: { id },
      relations: ['album'],
    });
  }

  getLastPageNumber(albumId: number): Promise<number> {
    return this.pageEntityRepository
      .createQueryBuilder('page')
      .select('MAX(page.number)', 'maxPageNumber')
      .where('page.albumId = :albumId', { albumId })
      .getRawOne()
      .then((result) => Number(result?.maxPageNumber) || 0);
  }

  update(id: number, data: any): Promise<any | null> {
    throw new Error('Method not implemented.');
  }
}
