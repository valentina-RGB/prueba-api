import { Test, TestingModule } from '@nestjs/testing';
import { ListPageUseCase } from '../../../../src/modules/albums/application/use-cases/page/list-page.use-case';
import { IPageRepositoryToken } from '../../../../src/modules/albums/domain/repositories/page.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { GetAlbumUseCase } from 'src/modules/albums/application/use-cases/album/get-album.use-case';
import { IAlbumRepositoryToken } from 'src/modules/albums/domain/repositories/album.repository.interface';

describe('ListPageUseCase', () => {
  let useCase: ListPageUseCase;
  let getAlbumUseCase: GetAlbumUseCase;
  let pageRepository: any;

  const mockAlbum = {
    id: 1,
    title: 'Álbum 1',
    description: 'Descripción 1',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPages = [
    {
      id: 1,
      title: 'Página 1',
      description: 'Descripción 1',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: 'Página 2',
      description: 'Descripción 2',
      status: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListPageUseCase,
        GetAlbumUseCase,
        {
          provide: IPageRepositoryToken,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockPages),
          },
        },
        {
          provide: GetAlbumUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockAlbum),
          },
        },
      ],
    }).compile();

    useCase = module.get(ListPageUseCase);
    getAlbumUseCase = module.get(GetAlbumUseCase);
    pageRepository = module.get(IPageRepositoryToken);
  });

  it('should return all pages', async () => {
    const result = await useCase.execute(mockAlbum.id);
    expect(result).toEqual(mockPages);
    expect(pageRepository.findAll).toHaveBeenCalled();
  });

  it('should throw NotFoundException if album is not found', async () => {
    jest.spyOn(getAlbumUseCase, 'execute').mockResolvedValue(null);
    await expect(useCase.execute(mockAlbum.id)).rejects.toThrow(
      NotFoundException,
    );
    expect(getAlbumUseCase.execute).toHaveBeenCalledWith(mockAlbum.id);
  });

  it('should throw NotFoundException if no pages are found', async () => {
    pageRepository.findAll.mockResolvedValue([]);
    await expect(useCase.execute(mockAlbum.id)).rejects.toThrow(
      NotFoundException,
    );
    expect(pageRepository.findAll).toHaveBeenCalled();
  });
});
