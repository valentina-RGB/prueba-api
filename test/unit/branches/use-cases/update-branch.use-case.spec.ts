import { Test, TestingModule } from '@nestjs/testing';
import {
  IBranchesRepository,
  IBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';
import { GetStampByBranch } from 'src/modules/albums/application/use-cases/stamp/get-stamp-by-branch-id.use-case';
import { UpdateStampUseCase } from 'src/modules/albums/application/use-cases/stamp/update-stamp.use-case';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateBranchUseCase } from 'src/modules/stores/application/use-cases/branches/update-branch.use-case';

describe('UpdateBranchUseCase', () => {
  let useCase: UpdateBranchUseCase;
  let branchRepository: jest.Mocked<IBranchesRepository>;
  let getStampByBranch: jest.Mocked<GetStampByBranch>;
  let updateStamp: jest.Mocked<UpdateStampUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateBranchUseCase,
        {
          provide: IBranchRepositoryToken,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: GetStampByBranch,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateStampUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(UpdateBranchUseCase);
    branchRepository = module.get(IBranchRepositoryToken);
    getStampByBranch = module.get(GetStampByBranch);
    updateStamp = module.get(UpdateStampUseCase);
  });

  const mockBranch = {
    id: 1,
    name: 'Old Branch Name',
    status: 'APPROVED',
  };

  const mockStamp = {
    id: 10,
    name: 'Old Branch Name',
  };

  it('should update branch and stamp name if name changes', async () => {
    const updateDto = { name: 'New Name' };

    branchRepository.findById.mockResolvedValue(mockBranch as any);
    getStampByBranch.execute.mockResolvedValue(mockStamp as any);
    updateStamp.execute.mockResolvedValue(undefined as any);
    branchRepository.update.mockResolvedValue({
      ...mockBranch,
      ...updateDto,
    } as any);

    const result = await useCase.execute({ id: 1, data: updateDto });

    expect(branchRepository.findById).toHaveBeenCalledWith(1);
    expect(getStampByBranch.execute).toHaveBeenCalledWith(1);
    expect(updateStamp.execute).toHaveBeenCalledWith({
      id: 10,
      data: { ...mockStamp, name: 'New Name' },
    });
    expect(branchRepository.update).toHaveBeenCalledWith(1, updateDto);
    expect(result.name).toBe('New Name');
  });

  it('should throw NotFoundException if branch is not found', async () => {
    branchRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: 1, data: { name: 'Name' } }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ConflictException if branch is not approved', async () => {
    branchRepository.findById.mockResolvedValue({
      ...mockBranch,
      status: 'PENDING',
    } as any);

    await expect(
      useCase.execute({ id: 1, data: { name: 'New Name' } }),
    ).rejects.toThrow(ConflictException);
  });

  it('should skip stamp update if name is not provided', async () => {
    const updateDto = { latitude: 12.345, longitude: -76.543 };

    branchRepository.findById.mockResolvedValue(mockBranch as any);
    branchRepository.update.mockResolvedValue({
      ...mockBranch,
      ...updateDto,
    } as any);

    const result = await useCase.execute({ id: 1, data: updateDto });

    expect(getStampByBranch.execute).not.toHaveBeenCalled();
    expect(updateStamp.execute).not.toHaveBeenCalled();
    expect(branchRepository.update).toHaveBeenCalledWith(1, updateDto);
    expect(result.latitude).toBe(12.345);
  });

  it('should throw NotFoundException if stamp not found when updating name', async () => {
    branchRepository.findById.mockResolvedValue(mockBranch as any);
    getStampByBranch.execute.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: 1, data: { name: 'New Name' } }),
    ).rejects.toThrow(NotFoundException);
  });
});
