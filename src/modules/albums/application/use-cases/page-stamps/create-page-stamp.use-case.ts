import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { GetPageUseCase } from '../page/get-page.use-case';
import {
  CreatePageStampsDto,
  PartialPageStampCreationResult,
} from '../../dto/page-stamp/create-page-stamp.dto';
import { IPageStamps } from 'src/modules/albums/domain/models/page-stamps.interface';
import {
  IPageStampsRepository,
  IPageStampsRepositoryToken,
} from 'src/modules/albums/domain/repositories/page-stamp.repository.interface';
import { GetStampUseCase } from '../stamp/get-stamp.use-case';

@Injectable()
export class CreatePageStampUseCase
  implements IUseCase<CreatePageStampsDto, PartialPageStampCreationResult>
{
  constructor(
    @Inject(IPageStampsRepositoryToken)
    private readonly pageStampsRepository: IPageStampsRepository,
    private readonly getPage: GetPageUseCase,
    private readonly getStamp: GetStampUseCase,
  ) {}

  async execute(
    data: CreatePageStampsDto,
  ): Promise<PartialPageStampCreationResult> {
    const page = await this.getPage.execute(data.pageId);
    if (!page) throw new NotFoundException('Page not found');

    const created: IPageStamps[] = [];
    const errors: { stampId: number; reason: string }[] = [];

    for (const stampId of data.stampIds) {
      try {
        const stamp = await this.getStamp.execute(stampId);
        if (!stamp) {
          errors.push({ stampId, reason: 'Stamp not found' });
          continue;
        }

        const pageStamp = await this.pageStampsRepository.create({
          page,
          stamp,
        });
        created.push(pageStamp);
      } catch (error) {
        errors.push({ stampId, reason: error.message || 'Unknown error' });
      }
    }

    return { created, errors };
  }
}
