import { Test, TestingModule } from '@nestjs/testing';
import { GetAnnualAlbumByYearUseCase } from '../../../../src/modules/albums/application/use-cases/album/get-album-by-year.use-case';
import { IAlbumRepository, IAlbumRepositoryToken } from '../../../../src/modules/albums/domain/repositories/album.repository.interface';
import { IAlbum } from '../../../../src/modules/albums/domain/models/album.interface';

describe('GetAnnualAlbumByYearUseCase', () => {
  let useCase: GetAnnualAlbumByYearUseCase;
  let albumRepository: jest.Mocked<IAlbumRepository>;

  const mockAnnualAlbum: IAlbum = {
    id: 1,
    type: 'ANNUAL',
    title: 'Annual Album 2023',
    introduction: 'Annual album for 2023',
    start_date: new Date('2023-01-01'),
    end_date: new Date('2023-12-31'),
    status: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAnnualAlbumByYearUseCase,
        {
          provide: IAlbumRepositoryToken,
          useValue: {
            findAnnualByYear: jest.fn(), 
          },
        },
      ],
    }).compile();

    useCase = module.get<GetAnnualAlbumByYearUseCase>(GetAnnualAlbumByYearUseCase);
    albumRepository = module.get<jest.Mocked<IAlbumRepository>>(IAlbumRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('debe retornar el álbum anual si existe para el año especificado', async () => {
    
    albumRepository.findAnnualByYear.mockResolvedValue(mockAnnualAlbum);

    const year = 2023;
    const result = await useCase.execute(year);

    expect(result).toEqual(mockAnnualAlbum);
    expect(albumRepository.findAnnualByYear).toHaveBeenCalledWith(year);
    expect(albumRepository.findAnnualByYear).toHaveBeenCalledTimes(1);
  });

  it('debe retornar null si no existe un álbum anual para el año especificado', async () => {
    
    albumRepository.findAnnualByYear.mockResolvedValue(null);

    const year = 2024;
    const result = await useCase.execute(year);

    expect(result).toBeNull();
    expect(albumRepository.findAnnualByYear).toHaveBeenCalledWith(year);
  });

  it('debe manejar correctamente errores inesperados del repositorio', async () => {
    
    albumRepository.findAnnualByYear.mockRejectedValue(new Error('Error de base de datos'));

    const year = 2023;
    
    await expect(useCase.execute(year)).rejects.toThrow('Error de base de datos');
    expect(albumRepository.findAnnualByYear).toHaveBeenCalledWith(year);
  });
});