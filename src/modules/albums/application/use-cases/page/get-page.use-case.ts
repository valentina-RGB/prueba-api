import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPage } from 'src/modules/albums/domain/models/page.interface';
import {
  IPageRepositoryToken,
  IPageRepository,
} from 'src/modules/albums/domain/repositories/page.repository.interface';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';

@Injectable()
export class GetPageUseCase implements IUseCase<number, IPage | null> {
  constructor(
    @Inject(IPageRepositoryToken)
    private readonly pageRepository: IPageRepository,
  ) {}

  async execute(id: number): Promise<IPage | null> {
    const user = await this.pageRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
