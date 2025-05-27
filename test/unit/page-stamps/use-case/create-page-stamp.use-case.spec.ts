import { Test, TestingModule } from '@nestjs/testing';
import { GetPageUseCase } from '../../../../src/modules/albums/application/use-cases/page/get-page.use-case';
import { GetStampUseCase } from '../../../../src/modules/albums/application/use-cases/stamp/get-stamp.use-case';
import { IPageStampsRepositoryToken } from '../../../../src/modules/albums/domain/repositories/page-stamp.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { CreatePageStampUseCase } from 'src/modules/albums/application/use-cases/page-stamps/create-page-stamp.use-case';

describe('CreatePageStampUseCase', () => {
  let useCase: CreatePageStampUseCase;
  let pageStampsRepository: any;
  let getPage: any;
  let getStamp: any;

  const mockPage = { id: 1, title: 'Página' };
  const mockStamp1 = { id: 1, name: 'Sello 1' };

  const mockCreatedPageStamp = (stampId: number) => ({
    id: stampId,
    page: mockPage,
    stamp: { id: stampId, name: `Sello ${stampId}` },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePageStampUseCase,
        {
          provide: IPageStampsRepositoryToken,
          useValue: {
            create: jest.fn((data) => Promise.resolve(mockCreatedPageStamp(data.stamp.id))),
          },
        },
        {
          provide: GetPageUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockPage),
          },
        },
        {
          provide: GetStampUseCase,
          useValue: {
            execute: jest.fn((id) => Promise.resolve({ id, name: `Sello ${id}` })),
          },
        },
      ],
    }).compile();

    useCase = module.get(CreatePageStampUseCase);
    pageStampsRepository = module.get(IPageStampsRepositoryToken);
    getPage = module.get(GetPageUseCase);
    getStamp = module.get(GetStampUseCase);
  });

  it('should create page stamps when all stamps exist', async () => {
    const result = await useCase.execute({ pageId: 1, stampIds: [1, 2] });

    expect(result.created).toHaveLength(2);
    expect(result.errors).toHaveLength(0);
    expect(getPage.execute).toHaveBeenCalledWith(1);
    expect(getStamp.execute).toHaveBeenCalledTimes(2);
    expect(pageStampsRepository.create).toHaveBeenCalledTimes(2);
  });

  it('should skip creation and return error if a stamp is not found', async () => {
    jest.spyOn(getStamp, 'execute').mockImplementation((id) => {
      if (id === 1) return Promise.resolve(mockStamp1);
      return Promise.resolve(null);
    });

    const result = await useCase.execute({ pageId: 1, stampIds: [1, 999] });

    expect(result.created).toHaveLength(1);
    expect(result.errors).toEqual([
      { stampId: 999, reason: 'Stamp not found' },
    ]);
  });

  it('should throw NotFoundException if page is not found', async () => {
    jest.spyOn(getPage, 'execute').mockResolvedValueOnce(null);

    await expect(useCase.execute({ pageId: 999, stampIds: [1, 2] })).rejects.toThrow(NotFoundException);
  });
});
