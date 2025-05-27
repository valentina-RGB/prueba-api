import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IStamps } from 'src/modules/albums/domain/models/stamps.interface';
import {
  IStampRepository,
  IStampRepositoryToken,
} from 'src/modules/albums/domain/repositories/stamp.repository.interface';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';
import { CreateStampDto } from '../../dto/stamp/create-stamp.dto';
import { GetAnnualAlbumByYearUseCase } from '../album/get-album-by-year.use-case';
import { CreatePageStampUseCase } from '../page-stamps/create-page-stamp.use-case';
import { ListPageUseCase } from '../page/list-page.use-case';

@Injectable()
export class CreateStampUseCase implements IUseCase<CreateStampDto, IStamps> {
  constructor(
    @Inject(IStampRepositoryToken)
    private readonly stampRepository: IStampRepository,
    private readonly getBranchUseCase: GetBranchUseCase,
    private readonly getAnnualAlbumByYearUseCase: GetAnnualAlbumByYearUseCase,
    private readonly getPageUseCase: ListPageUseCase,
    private readonly addStampToPageUseCase: CreatePageStampUseCase,
  ) {}

  async execute(data: CreateStampDto): Promise<IStamps> {
    const branch = await this.validateBranch(data.branch_id);

    const newStamp = await this.createStamp(data, branch);

    await this.addStampToAnnualAlbum(newStamp.id);

    return newStamp;
  }

  private async validateBranch(branchId: number) {
    const branch = await this.getBranchUseCase.execute(branchId);
    if (!branch) throw new NotFoundException('Branch not found');
    if (branch.status !== 'APPROVED')
      throw new BadRequestException('Branch is not approved');
    return branch;
  }

  private async createStamp(
    data: CreateStampDto,
    branch: any,
  ): Promise<IStamps> {
    const descriptionDefault= 'Sello que registra una nueva experiencia de café premium.'
    return this.stampRepository.create({
      branch: branch,
      logo: branch.store.logo,
      name: branch.name,
      description: descriptionDefault,
      coffeecoins_value: data.coffeecoins_value,
    });
  }
  
  private async addStampToAnnualAlbum(stampId: number): Promise<void> {
    const currentYear = new Date().getFullYear();
    const album = await this.getAnnualAlbumByYearUseCase.execute(currentYear);

    if (!album) {
      throw new ConflictException(
        `No annual album found for year ${currentYear}. Stamp created but not added to any page.`,
      );
    }

    const pages = await this.getPageUseCase.execute(album.id);
    
    const stampsPage = pages[0];
    if (!stampsPage) {
      throw new ConflictException(
        `No stamps page found in album ${album.id}. Stamp created but not added to any page.`,
      );
    }

    await this.addStampToPageUseCase.execute({
      pageId: stampsPage.id,
      stampIds: [stampId],
    });
  }
}
