import { Test, TestingModule } from '@nestjs/testing';
import { ListStampUseCase } from 'src/modules/albums/application/use-cases/stamp/list-stamp.use-case';
import { IStampRepository, IStampRepositoryToken } from 'src/modules/albums/domain/repositories/stamp.repository.interface';
import { IStamps } from 'src/modules/albums/domain/models/stamps.interface';

describe('ListStampUseCase', () => {
  let useCase: ListStampUseCase;
  let stampRepository: jest.Mocked<IStampRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListStampUseCase,
        {
          provide: IStampRepositoryToken,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<ListStampUseCase>(ListStampUseCase);
    stampRepository = module.get(IStampRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockStamp: IStamps = {
    id: 1,
    branch: {
      id: 1,
      store: {
        id: 1,
        name: 'Test Store',
        type_document: 'DNI',
        number_document: '12345678',
        logo: 'logo.jpg',
        phone_number: '123456789',
        email: 'store@test.com',
        status: 'APPROVED',
      },
      name: 'Test Branch',
      phone_number: '987654321',
      latitude: 0,
      longitude: 0,
      address: 'Test Address',
      status: 'APPROVED',
      is_open: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    logo: 'stamp-logo.jpg',
    name: 'Test Stamp',
    description: 'Test Description',
    coffeecoins_value: 10,
    status: true,
  };

  const mockStamp2: IStamps = {
    id: 2,
    branch: {
      id: 2,
      store: {
        id: 2,
        name: 'Second Store',
        type_document: 'NIT',
        number_document: '987654321',
        logo: 'logo2.jpg',
        phone_number: '987654321',
        email: 'store2@test.com',
        status: 'APPROVED',
      },
      name: 'Second Branch',
      phone_number: '123456789',
      latitude: 1,
      longitude: 1,
      address: 'Second Address',
      status: 'APPROVED',
      is_open: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    logo: 'stamp-logo2.jpg',
    name: 'Second Stamp',
    description: 'Second Description',
    coffeecoins_value: 20,
    status: false,
  };

  describe('execute', () => {
    it('should return an array of stamps when stamps exist', async () => {
      const stamps = [mockStamp, mockStamp2];
      stampRepository.findAll.mockResolvedValue(stamps);

      const result = await useCase.execute();

      expect(result).toEqual(stamps);
      expect(result.length).toBe(2);
      expect(stampRepository.findAll).toHaveBeenCalled();
      expect(result[0].name).toBe('Test Stamp');
      expect(result[1].name).toBe('Second Stamp');
      expect(result[0].branch.store.name).toBe('Test Store');
      expect(result[1].branch.store.name).toBe('Second Store');
    });

    it('should return an empty array when no stamps exist', async () => {
      stampRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
      expect(stampRepository.findAll).toHaveBeenCalled();
    });

    it('should verify the structure of returned stamps', async () => {
      const stamps = [mockStamp];
      stampRepository.findAll.mockResolvedValue(stamps);

      const result = await useCase.execute();
      const firstStamp = result[0];

      expect(firstStamp).toHaveProperty('id');
      expect(firstStamp).toHaveProperty('name');
      expect(firstStamp).toHaveProperty('description');
      expect(firstStamp).toHaveProperty('coffeecoins_value');
      expect(firstStamp).toHaveProperty('status');
      expect(firstStamp).toHaveProperty('branch');
      expect(firstStamp.branch).toHaveProperty('store');
      expect(firstStamp.branch.store).toHaveProperty('name');
    });

    it('should handle repository errors properly', async () => {
      stampRepository.findAll.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute()).rejects.toThrow('Database error');
    });
  });
});