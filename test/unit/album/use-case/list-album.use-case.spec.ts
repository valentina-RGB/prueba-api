import { Test, TestingModule } from '@nestjs/testing';
import { ListAlbumUseCase } from '../../../../src/modules/albums/application/use-cases/album/list-album.use-case';
import { IAlbumRepository, IAlbumRepositoryToken } from '../../../../src/modules/albums/domain/repositories/album.repository.interface';
import { IAlbum } from '../../../../src/modules/albums/domain/models/album.interface';

describe('ListAlbumUseCase', () => {
  let useCase: ListAlbumUseCase;
  let albumRepository: jest.Mocked<IAlbumRepository>;


  const mockAlbums: IAlbum[] = [
    {
      id: 1,
      type: 'EVENT',
      title: 'Event Album 1',
      start_date: new Date('2023-01-01'),
      end_date: new Date('2023-01-31'),
      status: true,
      introduction: 'Introduction 1',
    },
    {
      id: 2,
      type: 'ANNUAL',
      title: 'Annual Album 2023',
      start_date: new Date('2023-01-01'),
      end_date: new Date('2023-12-31'),
      status: true,
      introduction: 'Annual introduction',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListAlbumUseCase,
        {
          provide: IAlbumRepositoryToken,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<ListAlbumUseCase>(ListAlbumUseCase);
    albumRepository = module.get<jest.Mocked<IAlbumRepository>>(IAlbumRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('debe retornar un array de álbumes cuando existen registros', async () => {
   
    albumRepository.findAll.mockResolvedValue(mockAlbums);

    const result = await useCase.execute();

    expect(result).toEqual(mockAlbums);
    expect(albumRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result.length).toBe(2); // Verificar cantidad de álbumes
  });

  it('debe retornar un array vacío cuando no hay álbumes', async () => {
   
    albumRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(albumRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result.length).toBe(0);
  });

  it('debe manejar errores del repositorio correctamente', async () => {
   
    const errorMessage = 'Database connection failed';
    albumRepository.findAll.mockRejectedValue(new Error(errorMessage));

    await expect(useCase.execute()).rejects.toThrow(errorMessage);
    expect(albumRepository.findAll).toHaveBeenCalledTimes(1);
  });
});