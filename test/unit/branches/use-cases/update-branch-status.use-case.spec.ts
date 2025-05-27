import { Test, TestingModule } from '@nestjs/testing';
import {
  IBranchesRepository,
  IBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { IStore } from 'src/modules/stores/domain/models/store.interface';
import { NotFoundException } from '@nestjs/common';
import { UpdateBranchStatusUseCase } from 'src/modules/stores/application/use-cases/branches/update-branch-status.use-case';
import { CreateStampUseCase } from 'src/modules/albums/application/use-cases/stamp/create-stamp.use-case';

describe('UpdateBranchStatusUseCase', () => {
  let updateBranchStatusUseCase: UpdateBranchStatusUseCase;
  let branchRepository: IBranchesRepository;
  let createStampUseCase: CreateStampUseCase;

  beforeEach(async () => {
    const mockBranchRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    const mockCreateStampUseCase = {
      execute: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateBranchStatusUseCase,
        CreateStampUseCase,
        {
          provide: IBranchRepositoryToken,
          useValue: mockBranchRepository,
        },
        {
          provide: CreateStampUseCase,
          useValue: mockCreateStampUseCase,
        },
      ],
    }).compile();

    updateBranchStatusUseCase = moduleFixture.get<UpdateBranchStatusUseCase>(
      UpdateBranchStatusUseCase,
    );
    createStampUseCase =
      moduleFixture.get<CreateStampUseCase>(CreateStampUseCase);
    branchRepository = moduleFixture.get<IBranchesRepository>(
      IBranchRepositoryToken,
    );
  });

  const mockStore: IStore = {
    id: 1,
    name: 'Test Store',
    type_document: 'NIT',
    number_document: '900123456',
    logo: 'logo.png',
    phone_number: '3001234567',
    email: 'store@test.com',
    status: 'active',
  };

  const mockBranch: IBranches = {
    id: 1,
    name: 'Sucursal Test',
    phone_number: '3000000001',
    latitude: 0,
    longitude: 0,
    address: 'Calle 123',
    average_rating: 4.5,
    is_open: false,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
    store: mockStore,
  };

  it('should update branch status to APPROVED when data is true', async () => {
    jest
      .spyOn(branchRepository, 'findById')
      .mockResolvedValue({ ...mockBranch });
    jest.spyOn(branchRepository, 'update').mockResolvedValue({
      ...mockBranch,
      status: 'APPROVED',
    });

    const result = await updateBranchStatusUseCase.execute({
      id: 1,
      data: true,
    });

    expect(branchRepository.findById).toHaveBeenCalledWith(1);
    expect(branchRepository.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ status: 'APPROVED' }),
    );
    expect(result?.status).toBe('APPROVED');
  });

  it('should update branch status to REJECTED when data is false', async () => {
    jest
      .spyOn(branchRepository, 'findById')
      .mockResolvedValue({ ...mockBranch });
    jest.spyOn(branchRepository, 'update').mockResolvedValue({
      ...mockBranch,
      status: 'REJECTED',
    });

    const result = await updateBranchStatusUseCase.execute({
      id: 1,
      data: false,
    });

    expect(branchRepository.findById).toHaveBeenCalledWith(1);
    expect(branchRepository.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ status: 'REJECTED' }),
    );
    expect(result?.status).toBe('REJECTED');
  });

  it('should throw NotFoundException if branch is not found', async () => {
    jest.spyOn(branchRepository, 'findById').mockResolvedValue(null);

    await expect(
      updateBranchStatusUseCase.execute({ id: 99, data: true }),
    ).rejects.toThrow(NotFoundException);
    expect(branchRepository.findById).toHaveBeenCalledWith(99);
    expect(branchRepository.update).not.toHaveBeenCalled();
  });
});
