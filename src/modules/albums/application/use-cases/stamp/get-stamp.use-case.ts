import { Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IStamps } from 'src/modules/albums/domain/models/stamps.interface';
import {
  IStampRepository,
  IStampRepositoryToken,
} from 'src/modules/albums/domain/repositories/stamp.repository.interface';

export class GetStampUseCase implements IUseCase<number, IStamps | null> {
  constructor(
    @Inject(IStampRepositoryToken)
    private readonly stampRepository: IStampRepository,
  ) {}

  async execute(id: number): Promise<IStamps | null> {
    const stamp = await this.stampRepository.findById(id);
    if (!stamp) {
      throw new NotFoundException('Stamp not found');
    }
    return stamp;
  }
}
