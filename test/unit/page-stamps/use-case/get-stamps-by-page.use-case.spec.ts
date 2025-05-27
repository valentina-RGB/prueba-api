

import { Test, TestingModule } from '@nestjs/testing';
import { IPageStampsRepositoryToken } from '../../../../src/modules/albums/domain/repositories/page-stamp.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { GetStampsByPageIdUseCase } from 'src/modules/albums/application/use-cases/page-stamps/get-stamps-by-page.use-case';

describe('GetStampsByPageIdUseCase', () => {
  let useCase: GetStampsByPageIdUseCase;
  let repository: any;

  const mockPageStamps = [
    {
      id: 1,
      page: { id: 1 },
      stamp: { id: 101, name: 'Sello A' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      page: { id: 1 },
      stamp: { id: 102, name: 'Sello B' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStampsByPageIdUseCase,
        {
          provide: IPageStampsRepositoryToken,
          useValue: {
            findStampsByPage: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(GetStampsByPageIdUseCase);
    repository = module.get(IPageStampsRepositoryToken);
  });

  it('should return stamps for a valid page ID', async () => {
    repository.findStampsByPage.mockResolvedValue(mockPageStamps);

    const result = await useCase.execute(1);

    expect(result).toEqual(mockPageStamps);
    expect(repository.findStampsByPage).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if no stamps are found', async () => {
    repository.findStampsByPage.mockResolvedValue([]);

    await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
  });
});
