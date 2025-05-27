import { Injectable } from '@nestjs/common';
import { ImageEntity } from '../entities/images.entity';
import { IImageRepository } from '../../domain/repositories/image.repository.interface';
import { IImage } from '../../domain/models/images.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateImage } from '../../domain/dto/images.interface.dto';

@Injectable()
export class ImageRepository implements IImageRepository {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageEntityRepository: Repository<ImageEntity>,
  ) {}

  async createImages(data: ICreateImage[]): Promise<IImage[]> {
    const images = this.imageEntityRepository.create(data);
    return this.imageEntityRepository.save(images);
  }
  
  deleteImageById(id: number) {
    return this.imageEntityRepository.delete(id)
  }

  getImageById(id: number): Promise<IImage | null> {
    return this.imageEntityRepository.findOne({
      where: { id },
    });
  }

  GetImageByBranchId(branchId: number): Promise<IImage[]> {
    return this.imageEntityRepository.find({
      where: { related_id: branchId, related_type: 'BRANCH' },
      relations:['branch', 'branch.store'],
      order: {
        id: 'ASC',
      },
      
    });
  }
}
