import { Test, TestingModule } from '@nestjs/testing';
import {
  IAlbumRepository,
  IAlbumRepositoryToken,
} from '../../../../src/modules/albums/domain/repositories/album.repository.interface';
import { IAlbum } from '../../../../src/modules/albums/domain/models/album.interface';
import { GetAlbumUseCase } from 'src/modules/albums/application/use-cases/album/get-album.use-case';
import { NotFoundException } from '@nestjs/common';

describe('GetAlbumUseCase', () => {
  let useCase: GetAlbumUseCase;
  let albumRepository: jest.Mocked<IAlbumRepository>;

  const mockAlbum: IAlbum = {
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
        GetAlbumUseCase,
        {
          provide: IAlbumRepositoryToken,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetAlbumUseCase>(GetAlbumUseCase);
    albumRepository = module.get<jest.Mocked<IAlbumRepository>>(
      IAlbumRepositoryToken,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the album if found', async () => {
    albumRepository.findById.mockResolvedValueOnce(mockAlbum);

    const result = await useCase.execute(1);

    expect(albumRepository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockAlbum);
  });

  it('should throw NotFoundException if album is not found', async () => {
    albumRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute(999)).rejects.toThrow(
      new NotFoundException('Album with ID 999 not found'),
    );
    expect(albumRepository.findById).toHaveBeenCalledWith(999);
  });
});
