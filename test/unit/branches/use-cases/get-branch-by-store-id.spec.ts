import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetBranchByIdStoreUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch-by-id-store.use-case';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { IStore } from 'src/modules/stores/domain/models/store.interface';
import {
  IBranchesRepository,
  IBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';

describe('GetBranchByIdStoreUseCase', () => {
  let useCase: GetBranchByIdStoreUseCase;
  let repository: IBranchesRepository;

  beforeEach(async () => {
    const mockRepository = {
      findByStoreId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBranchByIdStoreUseCase,
        {
          provide: IBranchRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetBranchByIdStoreUseCase>(GetBranchByIdStoreUseCase);
    repository = module.get<IBranchesRepository>(IBranchRepositoryToken);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('execute', () => {
    it('should return branches for a valid store ID', async () => {
      const mockStore: IStore = {
        id: 1,
        name: 'Test Store',
        type_document: 'NIT',
        number_document: '900123456',
        logo: 'test-logo.png',
        phone_number: '3011234567',
        email: 'store@example.com',
        status: 'active',
      };

      const mockBranches: IBranches[] = [
        {
          id: 1,
          store: mockStore,
          name: 'Branch One',
          phone_number: '3001234567',
          latitude: 10.12345,
          longitude: -75.6789,
          address: '123 Main Street',
          average_rating: 4.5,
          is_open: true,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(repository, 'findByStoreId').mockResolvedValue(mockBranches);

      const result = await useCase.execute(1);

      expect(result).toEqual(mockBranches);
      expect(repository.findByStoreId).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for invalid store ID', async () => {
      const invalidIds = [NaN, 0];

      for (const invalidId of invalidIds) {
        await expect(useCase.execute(invalidId)).rejects.toThrow(
          new NotFoundException('Invalid store ID'),
        );
      }
    });

    it('should throw NotFoundException for null store ID', async () => {
      await expect(useCase.execute(null as any)).rejects.toThrow(
        new NotFoundException('Invalid store ID'),
      );
    });

    it('should throw NotFoundException for undefined store ID', async () => {
      await expect(useCase.execute(undefined as any)).rejects.toThrow(
        new NotFoundException('Invalid store ID'),
      );
    });

    it('should propagate repository errors', async () => {
      const validStoreId = 1;
      const error = new Error('Database error');
      jest.spyOn(repository, 'findByStoreId').mockRejectedValue(error);

      await expect(useCase.execute(validStoreId)).rejects.toThrow(error);
      expect(repository.findByStoreId).toHaveBeenCalledWith(validStoreId);
    });
  });
});
