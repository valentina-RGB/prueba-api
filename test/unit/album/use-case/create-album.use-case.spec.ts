import { Test, TestingModule } from '@nestjs/testing';
import { CreateAlbumUseCase } from '../../../../src/modules/albums/application/use-cases/album/create-album.use-case';
import {
  IAlbumRepository,
  IAlbumRepositoryToken,
} from '../../../../src/modules/albums/domain/repositories/album.repository.interface';
import { GetAnnualAlbumByYearUseCase } from '../../../../src/modules/albums/application/use-cases/album/get-album-by-year.use-case';

import { ConflictException } from '@nestjs/common';
import { IAlbum } from '../../../../src/modules/albums/domain/models/album.interface';
import { CreateAlbumDto } from 'src/modules/albums/application/dto/album/create-album.dto';
import { IEvent } from 'src/modules/events/domain/models/events.interface';
import { GetEventByIdUseCase } from 'src/modules/events/application/use-cases/events/get-event-by-id.use-case';
import { CreatePageUseCase } from 'src/modules/albums/application/use-cases/page/create-page.use-case';
import { CreatePageStampsToEventUseCase } from 'src/modules/albums/application/use-cases/page-stamps/create-page-stamps-to-event.use-case';

describe('CreateAlbumUseCase', () => {
  let useCase: CreateAlbumUseCase;
  let albumRepository: jest.Mocked<IAlbumRepository>;
  let getAlbumByYearUseCase: jest.Mocked<GetAnnualAlbumByYearUseCase>;
  let getEventByIdUseCase: jest.Mocked<GetEventByIdUseCase>;
  let createPageUseCase: jest.Mocked<CreatePageUseCase>;
  let createPageStampsToEventUseCase: jest.Mocked<CreatePageStampsToEventUseCase>;

  const TEST_YEAR = 2024;
  const mockStartDate = new Date(`${TEST_YEAR}-01-01`);
  const mockEndDate = new Date(`${TEST_YEAR}-12-31`);

  const mockAlbum: IAlbum = {
    id: 1,
    type: 'EVENT',
    title: 'Test Album',
    logo: 'logo.png',
    introduction: 'This is a test album',
    start_date: mockStartDate,
    end_date: mockEndDate,
    status: true,
  };

  const mockEvent: IEvent = {
    id: 10,
    name: 'Festival de Café',
    description: 'Evento genial',
    start_date: mockStartDate,
    end_date: mockEndDate,
    location: 'Medellín',
    is_free: true,
    value: 0,
    organizer: 'Café Org',
    status: 'PUBLISHED',
  };

  const mockPage = {
    album_id: 1,
    title: 'Página de Cafeterías',
    description: 'Sellos de las Cafeterías',
  };

  beforeEach(async () => {
    jest.spyOn(Date.prototype, 'getFullYear').mockReturnValue(TEST_YEAR);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAlbumUseCase,
        {
          provide: IAlbumRepositoryToken,
          useValue: {
            create: jest.fn((dto) => Promise.resolve({ ...mockAlbum, ...dto })),
          },
        },
        {
          provide: GetAnnualAlbumByYearUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: GetEventByIdUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockEvent),
          },
        },
        {
          provide: CreatePageUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockPage),
          },
        },
        {
          provide: CreatePageStampsToEventUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(CreateAlbumUseCase);
    albumRepository = module.get(IAlbumRepositoryToken);
    getAlbumByYearUseCase = module.get(GetAnnualAlbumByYearUseCase);
    getEventByIdUseCase = module.get(GetEventByIdUseCase);
    createPageUseCase = module.get(CreatePageUseCase);
    createPageStampsToEventUseCase = module.get(CreatePageStampsToEventUseCase);
    createPageStampsToEventUseCase = module.get(CreatePageStampsToEventUseCase);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should create an event album with valid event', async () => {
    const createDto: CreateAlbumDto = {
      type: 'EVENT',
      title: 'Event Album',
      introduction: 'With event',
      start_date: mockStartDate,
      end_date: mockEndDate,
      entity_id: mockEvent.id,
    };

    const result = await useCase.execute(createDto);

    expect(result).toBeDefined();
    expect(result.title).toBe(createDto.title);
    expect(getEventByIdUseCase.execute).toHaveBeenCalledWith({
      id: mockEvent.id,
    });
    expect(albumRepository.create).toHaveBeenCalledWith(createDto);
    expect(createPageUseCase.execute).toHaveBeenCalledWith(mockPage);
  });

  it('should fail if entity_id is missing in event album', async () => {
    const createDto = {
      type: 'EVENT',
      title: 'Missing Event ID',
      introduction: 'Fails',
      start_date: mockStartDate,
      end_date: mockEndDate,
    } as CreateAlbumDto;

    await expect(useCase.execute(createDto)).rejects.toThrow(ConflictException);
    expect(getEventByIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should fail if event is not found', async () => {
    getEventByIdUseCase.execute.mockResolvedValueOnce(null);

    const createDto: CreateAlbumDto = {
      type: 'EVENT',
      title: 'Unknown Event',
      introduction: 'Should fail',
      start_date: mockStartDate,
      end_date: mockEndDate,
      entity_id: 999,
    };

    await expect(useCase.execute(createDto)).rejects.toThrow(ConflictException);
  });

  it('should fail if album dates do not match event dates', async () => {
    const invalidDto: CreateAlbumDto = {
      type: 'EVENT',
      title: 'Wrong Dates',
      introduction: 'Date mismatch',
      start_date: new Date('2025-01-01'),
      end_date: new Date('2025-01-05'),
      entity_id: mockEvent.id,
    };

    await expect(useCase.execute(invalidDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should throw ConflictException when an annual album exists', async () => {
    getAlbumByYearUseCase.execute.mockResolvedValueOnce(mockAlbum);

    const createDto: CreateAlbumDto = {
      type: 'ANNUAL',
      title: 'Duplicate Annual',
      introduction: 'Fails',
      start_date: mockStartDate,
      end_date: mockEndDate,
    };

    await expect(useCase.execute(createDto)).rejects.toThrow(ConflictException);
  });
});
