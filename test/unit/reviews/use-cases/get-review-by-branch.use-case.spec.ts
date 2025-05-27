import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';
import { GetReviewByBranchUseCase } from 'src/modules/stores/application/use-cases/reviews/get-review-by-branch.use-case';
import {
  IReviewRepository,
  IReviewRepositoryToken,
} from 'src/modules/stores/domain/repositories/review.repository.interface';

describe('GetReviewByBranchUseCase', () => {
  let useCase: GetReviewByBranchUseCase;
  let reviewRepository: IReviewRepository;
  let getBranchById: GetBranchUseCase;

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
    social_networks: [
      {
        id: 1,
        branch_id: 1,
        social_network_id: 1,
        url: 'https://facebook.com',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockReviewRepository = {
      findAllByBranchId: jest.fn(),
    };

    const mockGetBranchUseCase = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        GetReviewByBranchUseCase,
        { provide: IReviewRepositoryToken, useValue: mockReviewRepository },
        { provide: GetBranchUseCase, useValue: mockGetBranchUseCase },
      ],
    }).compile();

    useCase = moduleRef.get(GetReviewByBranchUseCase);
    reviewRepository = moduleRef.get(IReviewRepositoryToken);
    getBranchById = moduleRef.get(GetBranchUseCase);
  });

  it('should return reviews for a branch', async () => {
    const mockReviews = [
      {
        id: 1,
        branch: mockBranch,
        client: mockClient,
        rating: 5,
        comment: 'Great service!',
        image_urls: ['image1', 'image2'],
      },
      {
        id: 2,
        branch: mockBranch,
        client: mockClient,
        rating: 4,
        comment: 'Good experience.',
        image_urls: [],
      },
    ];

    jest.spyOn(getBranchById, 'execute').mockResolvedValue(mockBranch);
    jest
      .spyOn(reviewRepository, 'findAllByBranchId')
      .mockResolvedValue(mockReviews);

    const result = await useCase.execute(1);

    expect(result).toEqual(mockReviews);
    expect(getBranchById.execute).toHaveBeenCalledWith(1);
    expect(reviewRepository.findAllByBranchId).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if no reviews found', async () => {
    jest.spyOn(getBranchById, 'execute').mockResolvedValue(mockBranch);
    jest.spyOn(reviewRepository, 'findAllByBranchId').mockResolvedValue([]);

    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
    expect(getBranchById.execute).toHaveBeenCalledWith(1);
    expect(reviewRepository.findAllByBranchId).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if branch not found', async () => {
    jest.spyOn(getBranchById, 'execute').mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
    expect(getBranchById.execute).toHaveBeenCalledWith(999);
    expect(reviewRepository.findAllByBranchId).not.toHaveBeenCalled();
  });
});
