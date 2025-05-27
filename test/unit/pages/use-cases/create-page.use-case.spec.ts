import { Test, TestingModule } from '@nestjs/testing';
import { CreatePageUseCase } from '../../../../src/modules/albums/application/use-cases/page/create-page.use-case';
import { IPageRepositoryToken } from '../../../../src/modules/albums/domain/repositories/page.repository.interface';
import { GetAlbumUseCase } from '../../../../src/modules/albums/application/use-cases/album/get-album.use-case';
import { NotFoundException } from '@nestjs/common';

describe('CreatePageUseCase', () => {
  let useCase: CreatePageUseCase;
  let pageRepository: any;
  let getAlbumUseCase: any;

  const mockAlbum = { id: 1, title: 'Álbum 2024' };
  const mockPage = {
    id: 1,
    title: 'Primera Página',
    description: 'Bienvenida al álbum',
    status: true,
    album: mockAlbum,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createDto = {
    title: 'Primera Página',
    description: 'Bienvenida al álbum',
    status: true,
    album_id: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePageUseCase,
        {
          provide: IPageRepositoryToken,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPage),
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

    useCase = module.get<CreatePageUseCase>(CreatePageUseCase);
    pageRepository = module.get(IPageRepositoryToken);
    getAlbumUseCase = module.get(GetAlbumUseCase);
  });

  it('should create a page if album exists', async () => {
    const result = await useCase.execute(createDto);
    expect(result).toEqual(mockPage);
    expect(getAlbumUseCase.execute).toHaveBeenCalledWith(createDto.album_id);
    expect(pageRepository.create).toHaveBeenCalledWith({
      title: createDto.title,
      description: createDto.description,
      status: createDto.status,
      album: mockAlbum,
    });
  });

  it('should throw NotFoundException if album does not exist', async () => {
    jest.spyOn(getAlbumUseCase, 'execute').mockResolvedValueOnce(null);

    await expect(useCase.execute(createDto)).rejects.toThrow(NotFoundException);
    expect(getAlbumUseCase.execute).toHaveBeenCalledWith(createDto.album_id);
    expect(pageRepository.create).not.toHaveBeenCalled();
  });
});
