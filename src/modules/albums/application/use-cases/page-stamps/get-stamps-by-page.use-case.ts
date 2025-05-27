import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import {
  IPageStampsRepository,
  IPageStampsRepositoryToken,
} from 'src/modules/albums/domain/repositories/page-stamp.repository.interface';
import { IPageStamps } from 'src/modules/albums/domain/models/page-stamps.interface';

@Injectable()
export class GetStampsByPageIdUseCase
  implements IUseCase<number, IPageStamps[]>
{
  constructor(
    @Inject(IPageStampsRepositoryToken)
    private readonly pageStampsRepository: IPageStampsRepository,
  ) {}

  async execute(pageId: number): Promise<IPageStamps[]> {
    const stamps = await this.pageStampsRepository.findStampsByPage(pageId);

    if (!stamps || stamps.length === 0) {
      throw new NotFoundException('No stamps found for this page');
    }

    return stamps;
  }
}
