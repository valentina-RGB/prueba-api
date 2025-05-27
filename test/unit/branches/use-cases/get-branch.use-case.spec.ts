import { Test, TestingModule } from '@nestjs/testing';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';
import {
  IBranchesRepository,
  IBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { NotFoundException } from '@nestjs/common';
import { IStore } from 'src/modules/stores/domain/models/store.interface';

describe('GetBranchUseCase', () => {
  let getBranchUseCase: GetBranchUseCase;
  let branchRepository: IBranchesRepository;

  beforeEach(async () => {
    const mockBranchRepository = {
      findById: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        GetBranchUseCase,
        {
          provide: IBranchRepositoryToken,
          useValue: mockBranchRepository,
        },
      ],
    }).compile();

    getBranchUseCase = moduleFixture.get<GetBranchUseCase>(GetBranchUseCase);
    branchRepository = moduleFixture.get<IBranchesRepository>(
      IBranchRepositoryToken,
    );
  });

  it('should return a branch by id successfully', async () => {
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

    const mockBranch: IBranches = {
      id: 1,
      store: mockStore,
      name: 'Branch One',
      phone_number: '3001234567',
      latitude: 10.12345,
      longitude: -75.6789,
      address: '123 Main Street',
      average_rating: 4.5,
      is_open: true,
      status: 'APPROVED',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(branchRepository, 'findById').mockResolvedValue(mockBranch);

    const result = await getBranchUseCase.execute(1);

    expect(result).toEqual(mockBranch);
    expect(branchRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw a NotFoundException if the branch does not exist', async () => {
    jest.spyOn(branchRepository, 'findById').mockResolvedValue(null);

    await expect(getBranchUseCase.execute(99)).rejects.toThrow(
      new NotFoundException('Branch not found'),
    );

    expect(branchRepository.findById).toHaveBeenCalledWith(99);
  });
});
