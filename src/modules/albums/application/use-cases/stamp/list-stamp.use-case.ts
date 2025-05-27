import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IStamps } from 'src/modules/albums/domain/models/stamps.interface';
import {
  IStampRepository,
  IStampRepositoryToken,
} from 'src/modules/albums/domain/repositories/stamp.repository.interface';

@Injectable()
export class ListStampUseCase implements IUseCase<void, IStamps[]> {
  constructor(
    @Inject(IStampRepositoryToken)
    private readonly stampRepository: IStampRepository,
  ) {}

  async execute(): Promise<IStamps[]> {
    return this.stampRepository.findAll();
  }
}
