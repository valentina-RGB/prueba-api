import { Test, TestingModule } from '@nestjs/testing';

import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { GetAnnualAlbumByYearUseCase } from 'src/modules/albums/application/use-cases/album/get-album-by-year.use-case';
import { CreatePageStampUseCase } from 'src/modules/albums/application/use-cases/page-stamps/create-page-stamp.use-case';
import { ListPageUseCase } from 'src/modules/albums/application/use-cases/page/list-page.use-case';
import { CreateStampUseCase } from 'src/modules/albums/application/use-cases/stamp/create-stamp.use-case';
import { IStampRepository, IStampRepositoryToken } from 'src/modules/albums/domain/repositories/stamp.repository.interface';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';

describe('CreateStampUseCase', () => {
  let useCase: CreateStampUseCase;
  let stampRepository: jest.Mocked<IStampRepository>;
  let getBranchUseCase: jest.Mocked<GetBranchUseCase>;
  let getAnnualAlbumByYearUseCase: jest.Mocked<GetAnnualAlbumByYearUseCase>;
  let getPageUseCase: jest.Mocked<ListPageUseCase>;
  let addStampToPageUseCase: jest.Mocked<CreatePageStampUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateStampUseCase,
        {
          provide: IStampRepositoryToken,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: GetBranchUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetAnnualAlbumByYearUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ListPageUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CreatePageStampUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateStampUseCase>(CreateStampUseCase);
    stampRepository = module.get(IStampRepositoryToken);
    getBranchUseCase = module.get(GetBranchUseCase);
    getAnnualAlbumByYearUseCase = module.get(GetAnnualAlbumByYearUseCase);
    getPageUseCase = module.get(ListPageUseCase);
    addStampToPageUseCase = module.get(CreatePageStampUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockStore = {
    id: 1,
    name: 'Tienda Test',
    type_document: 'NIT',
    number_document: '765455559-3',
    logo: 'logo.png',
    phone_number: '987654321',
    email: 'example@gmail.com',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBranch = {
    id: 1,
    name: 'Sucursal Nueva',
    address: 'Calle 123',
    status: 'APPROVED',
    latitude: 0,
    longitude: 0,
    average_rating: 0,
    phone_number: '000',
    is_open: true,
    store: mockStore,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStampData = {
    branch_id: 2,
    name: mockBranch.name,
    description: 'Sello que registra una nueva experiencia de café premium.',
    coffeecoins_value: 10,
  };

  const mockCreatedStamp = {
    id: 9,
    logo: 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    name: 'Encafeinados campo',
    description: 'Sello que registra una nueva experiencia de café premium.',
    coffeecoins_value: 10,
    status: true,
    branch: mockBranch,
  };

  const TEST_YEAR = 2024;
  const mockStartDate = new Date(`${TEST_YEAR}-01-01`);
  const mockEndDate = new Date(`${TEST_YEAR}-12-31`);

  const mockAlbum = {
    id: 1,
    type: 'EVENT',
    title: 'Test Album',
    logo: 'logo.png',
    introduction: 'This is a test album',
    start_date: mockStartDate,
    end_date: mockEndDate,
    status: true,
  };

  const mockPages = [
    {
      id: 1,
      title: 'Primera Página',
      description: 'Bienvenida al álbum',
      status: true,
      album: mockAlbum,
    },
  ];

  const mockPageStamps = {
    created: [
      {
        id: 1,
        page: mockPages[0],
        stamp: mockCreatedStamp,
      },
    ],
    errors: [
      {
        stampId: 1,
        reason: 'si',
      },
    ],
  };

  describe('execute', () => {
    it('should create a new stamp successfully', async () => {
      getBranchUseCase.execute.mockResolvedValue(mockBranch);
      stampRepository.create.mockResolvedValue(mockCreatedStamp);
      getAnnualAlbumByYearUseCase.execute.mockResolvedValue(mockAlbum);
      getPageUseCase.execute.mockResolvedValue(mockPages);
      addStampToPageUseCase.execute.mockResolvedValue(mockPageStamps);

      const result = await useCase.execute(mockStampData);

      expect(result).toEqual(mockCreatedStamp);
      expect(getBranchUseCase.execute).toHaveBeenCalledWith(
        mockStampData.branch_id,
      );
      expect(stampRepository.create).toHaveBeenCalledWith({
        branch: mockBranch,
        logo: mockBranch.store.logo,
        name: mockBranch.name,
        description: mockStampData.description,
        coffeecoins_value: mockStampData.coffeecoins_value,
      });
      expect(getAnnualAlbumByYearUseCase.execute).toHaveBeenCalledWith(
        new Date().getFullYear(),
      );
      expect(getPageUseCase.execute).toHaveBeenCalledWith(mockAlbum.id);
      expect(addStampToPageUseCase.execute).toHaveBeenCalledWith({
        pageId: mockPages[0].id,
        stampIds: [mockCreatedStamp.id],
      });
    });

    it('should throw NotFoundException when branch does not exist', async () => {
      getBranchUseCase.execute.mockResolvedValue(null);

      await expect(useCase.execute(mockStampData)).rejects.toThrow(
        NotFoundException,
      );
      expect(getBranchUseCase.execute).toHaveBeenCalledWith(
        mockStampData.branch_id,
      );
    });

    it('should throw BadRequestException when branch is not approved', async () => {
      getBranchUseCase.execute.mockResolvedValue({
        ...mockBranch,
        status: 'PENDING',
      });

      await expect(useCase.execute(mockStampData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should still create stamp but throw ConflictException when no annual album exists', async () => {
      getBranchUseCase.execute.mockResolvedValue(mockBranch);
      stampRepository.create.mockResolvedValue(mockCreatedStamp);
      getAnnualAlbumByYearUseCase.execute.mockResolvedValue(null);

      await expect(useCase.execute(mockStampData)).rejects.toThrow(
        ConflictException,
      );
      expect(stampRepository.create).toHaveBeenCalled();
    });

    it('should still create stamp but throw ConflictException when no stamps page exists in album', async () => {
      getBranchUseCase.execute.mockResolvedValue(mockBranch);
      stampRepository.create.mockResolvedValue(mockCreatedStamp);
      getAnnualAlbumByYearUseCase.execute.mockResolvedValue(mockAlbum);
      getPageUseCase.execute.mockResolvedValue([]);

      await expect(useCase.execute(mockStampData)).rejects.toThrow(
        ConflictException,
      );
      expect(stampRepository.create).toHaveBeenCalled();
    });
  });

  describe('validateBranch', () => {
    it('should return branch if it exists and is approved', async () => {
      getBranchUseCase.execute.mockResolvedValue(mockBranch);

      const result = await useCase['validateBranch'](mockBranch.id);

      expect(result).toEqual(mockBranch);
    });

    it('should throw NotFoundException if branch does not exist', async () => {
      getBranchUseCase.execute.mockResolvedValue(null);

      await expect(useCase['validateBranch'](mockBranch.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if branch is not approved', async () => {
      getBranchUseCase.execute.mockResolvedValue({
        ...mockBranch,
        status: 'REJECTED',
      });

      await expect(useCase['validateBranch'](mockBranch.id)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('createStamp', () => {
    it('should create and return a new stamp', async () => {
      stampRepository.create.mockResolvedValue(mockCreatedStamp);

      const result = await useCase['createStamp'](mockStampData, mockBranch);

      expect(result).toEqual(mockCreatedStamp);
      expect(stampRepository.create).toHaveBeenCalledWith({
        branch: mockBranch,
        logo: mockBranch.store.logo,
        name: mockStampData.name,
        description: mockStampData.description,
        coffeecoins_value: mockStampData.coffeecoins_value,
      });
    });
  });

  describe('addStampToAnnualAlbum', () => {
    it('should add stamp to album successfully', async () => {
      const stampId = 1;
      getAnnualAlbumByYearUseCase.execute.mockResolvedValue(mockAlbum);
      getPageUseCase.execute.mockResolvedValue(mockPages);
      addStampToPageUseCase.execute.mockResolvedValue(mockPageStamps);

      await useCase['addStampToAnnualAlbum'](stampId);

      expect(getAnnualAlbumByYearUseCase.execute).toHaveBeenCalledWith(
        new Date().getFullYear(),
      );
      expect(getPageUseCase.execute).toHaveBeenCalledWith(mockAlbum.id);
      expect(addStampToPageUseCase.execute).toHaveBeenCalledWith({
        pageId: mockPages[0].id,
        stampIds: [stampId],
      });
    });

    it('should throw ConflictException if no annual album exists', async () => {
      const stampId = 1;
      getAnnualAlbumByYearUseCase.execute.mockResolvedValue(null);

      await expect(useCase['addStampToAnnualAlbum'](stampId)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if no stamps page exists in album', async () => {
      const stampId = 1;
      getAnnualAlbumByYearUseCase.execute.mockResolvedValue(mockAlbum);
      getPageUseCase.execute.mockResolvedValue([]);

      await expect(useCase['addStampToAnnualAlbum'](stampId)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
