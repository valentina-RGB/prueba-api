import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IImageRepositoryToken, IImageRepository } from 'src/modules/stores/domain/repositories/image.repository.interface';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';

@Injectable()
export class DeleteImageUseCase implements IUseCase<number, void> {
  constructor(
    @Inject(IImageRepositoryToken)
    private readonly imageRepository: IImageRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const image = await this.imageRepository.getImageById(id); 

    if (!image) {
      throw new NotFoundException(`Image with id ${id} not found`);
    }

    return await this.imageRepository.deleteImageById(id);

  }
}
