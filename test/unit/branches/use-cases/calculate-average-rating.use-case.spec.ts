import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CalculateAverageRatingUseCase } from 'src/modules/stores/application/use-cases/branches/calculate-average-rating.use-case';
import {
  IBranchesRepository,
  IBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';
import { GetReviewByBranchUseCase } from 'src/modules/stores/application/use-cases/reviews/get-review-by-branch.use-case';

describe('CalculateAverageRatingUseCase', () => {
  let useCase: CalculateAverageRatingUseCase;
  let branchRepository: jest.Mocked<IBranchesRepository>;
  let getReviewsByBranchUseCase: jest.Mocked<GetReviewByBranchUseCase>;

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
    status: 'PENDING',
    latitude: 0,
    longitude: 0,
    average_rating: 0,
    phone_number: '000',
    is_open: true,
    store: mockStore,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockClient = {
    id: 1,
    person: {
      id: 1,
      user: {
        id: 1,
        email: 'test@example.com',
        role: { id: 1, name: 'Admin', status: true },
        status: true,
      },
      type_document: 'CC',
      number_document: '123456',
      full_name: 'John Doe',
      phone_number: '3001234567',
    },
    coffee_coins: 0,
    is_verified: true,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CalculateAverageRatingUseCase,
        {
          provide: IBranchRepositoryToken,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: GetReviewByBranchUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = moduleRef.get(CalculateAverageRatingUseCase);
    branchRepository = moduleRef.get(IBranchRepositoryToken);
    getReviewsByBranchUseCase = moduleRef.get(GetReviewByBranchUseCase);
  });

  it('should calculate and update average rating correctly', async () => {
    const reviews = [
      { id: 1, client: mockClient, branch: mockBranch, rating: 4 },
      {
        id: 2,
        client: mockClient,
        branch: mockBranch,
        rating: 5,
        comment: 'Great!',
      },
    ];

    branchRepository.findById.mockResolvedValue({ ...mockBranch });
    getReviewsByBranchUseCase.execute.mockResolvedValue(reviews);

    await useCase.execute(1);

    expect(branchRepository.findById).toHaveBeenCalledWith(1);
    expect(getReviewsByBranchUseCase.execute).toHaveBeenCalledWith(1);
    expect(branchRepository.update).toHaveBeenCalledWith(1, {
      ...mockBranch,
      average_rating: 4.5,
    });
  });

  it('should set average rating to 0 if there are no reviews', async () => {
    branchRepository.findById.mockResolvedValue({ ...mockBranch });
    getReviewsByBranchUseCase.execute.mockResolvedValue([]);

    await useCase.execute(1);

    expect(branchRepository.update).toHaveBeenCalledWith(1, {
      ...mockBranch,
      average_rating: 0,
    });
  });

  it('should throw NotFoundException if branch not found', async () => {
    branchRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
    expect(branchRepository.findById).toHaveBeenCalledWith(999);
    expect(getReviewsByBranchUseCase.execute).not.toHaveBeenCalled();
    expect(branchRepository.update).not.toHaveBeenCalled();
  });
});
