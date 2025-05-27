import { Test, TestingModule } from '@nestjs/testing';

import { StampRepository } from 'src/modules/albums/infrastructure/repositories/stamp.repository';
import { NotFoundException } from '@nestjs/common';
import { IStamps } from 'src/modules/albums/domain/models/stamps.interface';
import { GetStampByBranch } from 'src/modules/albums/application/use-cases/stamp/get-stamp-by-branch-id.use-case';
import { IStampRepositoryToken } from 'src/modules/albums/domain/repositories/stamp.repository.interface';

describe('GetStampByBranch', () => {
  let useCase: GetStampByBranch;
  let stampRepository: jest.Mocked<StampRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStampByBranch,
        {
          provide: IStampRepositoryToken,
          useValue: {
            ListStampByIdBranch: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetStampByBranch>(GetStampByBranch);
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
    it('should return stamp when found for branch id', async () => {
      const branchId = 1;
      stampRepository.ListStampByIdBranch.mockResolvedValue(mockStamp);

      const result = await useCase.execute(branchId);

      expect(result).toEqual(mockStamp);
      expect(stampRepository.ListStampByIdBranch).toHaveBeenCalledWith(branchId);
    });

    it('should return null when no stamp found for branch id', async () => {
      const branchId = 2;
      stampRepository.ListStampByIdBranch.mockResolvedValue(null);

      const result = await useCase.execute(branchId);

      expect(result).toBeNull();
      expect(stampRepository.ListStampByIdBranch).toHaveBeenCalledWith(branchId);
    });

    it('should throw NotFoundException when branch id is invalid (NaN)', async () => {
      const invalidBranchId = NaN;

      await expect(useCase.execute(invalidBranchId)).rejects.toThrow(NotFoundException);
      expect(stampRepository.ListStampByIdBranch).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when branch id is invalid (0)', async () => {
      await expect(useCase.execute(0)).rejects.toThrow(NotFoundException);
      expect(stampRepository.ListStampByIdBranch).not.toHaveBeenCalled();
    });
  });
});