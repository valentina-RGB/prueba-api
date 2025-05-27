import { Test, TestingModule } from '@nestjs/testing';
import { GetPageUseCase } from '../../../../src/modules/albums/application/use-cases/page/get-page.use-case';
import { IPageRepositoryToken } from '../../../../src/modules/albums/domain/repositories/page.repository.interface';
import { NotFoundException } from '@nestjs/common';

describe('GetPageUseCase', () => {
  let useCase: GetPageUseCase;
  let pageRepository: any;

  const mockPage = {
    id: 1,
    title: 'Primera Página',
    description: 'Bienvenida al álbum',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPageUseCase,
        {
          provide: IPageRepositoryToken,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockPage),
          },
        },
      ],
    }).compile();

    useCase = module.get(GetPageUseCase);
    pageRepository = module.get(IPageRepositoryToken);
  });

  it('should return a page when found', async () => {
    const result = await useCase.execute(1);
    expect(result).toEqual(mockPage);
    expect(pageRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if page is not found', async () => {
    jest.spyOn(pageRepository, 'findById').mockResolvedValueOnce(null);

    await expect(useCase.execute(99)).rejects.toThrow(NotFoundException);
    expect(pageRepository.findById).toHaveBeenCalledWith(99);
  });
});
