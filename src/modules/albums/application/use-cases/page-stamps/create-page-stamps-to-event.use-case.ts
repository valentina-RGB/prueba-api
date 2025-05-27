import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import {
  IPageStampsRepositoryToken,
  IPageStampsRepository,
} from 'src/modules/albums/domain/repositories/page-stamp.repository.interface';
import { GetEventBranchesByEventUseCase } from 'src/modules/events/application/use-cases/events-branches/get-event-branches-by-event.use-case';
import { GetStampByBranch } from '../stamp/get-stamp-by-branch-id.use-case';
import { GetPageUseCase } from '../page/get-page.use-case';
import { IPageStamps } from 'src/modules/albums/domain/models/page-stamps.interface';
import { PartialPageStampCreationResult } from '../../dto/page-stamp/create-page-stamp.dto';

@Injectable()
export class CreatePageStampsToEventUseCase
  implements
    IUseCase<
      { pageId: number; eventId: number },
      PartialPageStampCreationResult
    >
{
  constructor(
    @Inject(IPageStampsRepositoryToken)
    private readonly pageStampsRepository: IPageStampsRepository,
    private readonly getPage: GetPageUseCase,
    private readonly getEventBranches: GetEventBranchesByEventUseCase,
    private readonly getStampsByBranch: GetStampByBranch,
  ) {}

  async execute({
    pageId,
    eventId,
  }: {
    pageId: number;
    eventId: number;
  }): Promise<PartialPageStampCreationResult> {
    const page = await this.getPage.execute(pageId);
    if (!page) throw new NotFoundException('Page not found');

    const branches = await this.getEventBranches.execute(eventId);
    if (!branches?.length)
      throw new NotFoundException('No branches found for the event');

    const stamps = await Promise.all(
      branches.map(async (branch) => {
        const stamp = await this.getStampsByBranch.execute(branch.branch.id);
        if (!stamp) {
          return null;
        }
        return stamp;
      }),
    );

    const created: IPageStamps[] = [];
    const errors: { stampId: number; reason: string }[] = [];

    for (const stamp of stamps) {
      if (stamp === null) continue;

      try {
        const pageStamp = await this.pageStampsRepository.create({
          page,
          stamp,
        });
        created.push(pageStamp);

      } catch (error) {
        errors.push({
          stampId: stamp.id,
          reason: error.message || 'Unknown error',
        });
      }
    }

    return { created, errors };
  }
}
