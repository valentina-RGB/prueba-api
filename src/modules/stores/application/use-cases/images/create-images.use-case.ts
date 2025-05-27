import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IImage } from 'src/modules/stores/domain/models/images.interface';
import {
  IImageRepositoryToken,
  IImageRepository,
} from 'src/modules/stores/domain/repositories/image.repository.interface';
import { GetBranchUseCase } from '../branches/get-branch.use-case';
import {
  ICreateImage,
  ICreateMultipleImages,
} from 'src/modules/stores/domain/dto/images.interface.dto';

@Injectable()
export class CreateImagesUseCase
  implements IUseCase<ICreateMultipleImages, IImage[]>
{
  constructor(
    @Inject(IImageRepositoryToken)
    private readonly imageRepository: IImageRepository,
    private readonly getBranchById: GetBranchUseCase,
  ) {}

  async execute(data: ICreateMultipleImages): Promise<IImage[]> {
    if (data.related_type === 'BRANCH') {
      const branch = await this.getBranchById.execute(data.related_id);
      if (!branch) throw new NotFoundException('Branch not found');
    }

    const imagesToCreate: ICreateImage[] = data.images.map((img) => ({
      ...img,
      related_type: data.related_type,
      related_id: data.related_id,
    }));

    return await this.imageRepository.createImages(imagesToCreate);
  }
}
