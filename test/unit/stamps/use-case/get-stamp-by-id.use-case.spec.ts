import { Test, TestingModule } from '@nestjs/testing';

import { IStampRepository, IStampRepositoryToken } from 'src/modules/albums/domain/repositories/stamp.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { IStamps } from 'src/modules/albums/domain/models/stamps.interface';
import { GetStampUseCase } from 'src/modules/albums/application/use-cases/stamp/get-stamp.use-case';

describe('GetStampUseCase', () => {
  let useCase: GetStampUseCase;
  let stampRepository: jest.Mocked<IStampRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStampUseCase,
        {
          provide: IStampRepositoryToken,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetStampUseCase>(GetStampUseCase);
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

  describe('execute', () => {
    it('should return stamp when found by id', async () => {
      const stampId = 1;
      stampRepository.findById.mockResolvedValue(mockStamp);

      const result = await useCase.execute(stampId);

      expect(result).toEqual(mockStamp);
      expect(stampRepository.findById).toHaveBeenCalledWith(stampId);
    });

    it('should throw NotFoundException when stamp is not found', async () => {
      const stampId = 999;
      stampRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(stampId)).rejects.toThrow(NotFoundException);
      expect(stampRepository.findById).toHaveBeenCalledWith(stampId);
    });
  });
});