import { Test } from '@nestjs/testing';
import {
  IReviewRepository,
  IReviewRepositoryToken,
} from 'src/modules/stores/domain/repositories/review.repository.interface';

import { GetClientByUserUseCase } from 'src/modules/users/application/use-cases/clients/get-client-by-user.use-case';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';
import { CreateReviewUseCase } from 'src/modules/stores/application/use-cases/reviews/create-review.use-case';
import { IReview } from 'src/modules/stores/domain/models/review.interface';
import { AddCoffeeCoinsToClientUseCase } from 'src/modules/users/application/use-cases/clients/add-coffee-coins.use-case';
import { IClient } from 'src/modules/users/domain/models/client.interface';
import { CalculateAverageRatingUseCase } from 'src/modules/stores/application/use-cases/branches/calculate-average-rating.use-case';
import { IBranchRepositoryToken } from 'src/modules/stores/domain/repositories/branches.repository.interface';
import { GetReviewByBranchUseCase } from 'src/modules/stores/application/use-cases/reviews/get-review-by-branch.use-case';

describe('CreateReviewUseCase', () => {
  let useCase: CreateReviewUseCase;
  let reviewRepository: IReviewRepository;
  let getBranchUseCase: GetBranchUseCase;
  let getClientByUserUseCase: GetClientByUserUseCase;
  let addCoffeeCoinsUseCase: AddCoffeeCoinsToClientUseCase;
  let calculateAverageRatingUseCase: CalculateAverageRatingUseCase;

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
    is_verified: false,
  };

  beforeEach(async () => {
    const mockReviewRepository = {
      create: jest.fn(),
    };

    const mockGetBranchUseCase = {
      execute: jest.fn(),
    };

    const mockGetClientByUserUseCase = {
      execute: jest.fn(),
    };

    const mockAddCoffeeCoins = {
      execute: jest.fn(),
    };

    const mockGetReviewByBranchUseCase = {
      execute: jest.fn(),
    };

    const mockBranchesRepository = {
      findById: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateReviewUseCase,
        AddCoffeeCoinsToClientUseCase,
        CalculateAverageRatingUseCase,
        {
          provide: GetReviewByBranchUseCase,
          useValue: mockGetReviewByBranchUseCase,
        },
        { provide: IReviewRepositoryToken, useValue: mockReviewRepository },
        { provide: GetBranchUseCase, useValue: mockGetBranchUseCase },
        {
          provide: GetClientByUserUseCase,
          useValue: mockGetClientByUserUseCase,
        },
        { provide: IBranchRepositoryToken, useValue: mockBranchesRepository },
        {
          provide: AddCoffeeCoinsToClientUseCase,
          useValue: mockAddCoffeeCoins,
        },
      ],
    }).compile();

    useCase = moduleRef.get(CreateReviewUseCase);
    reviewRepository = moduleRef.get(IReviewRepositoryToken);
    getBranchUseCase = moduleRef.get(GetBranchUseCase);
    getClientByUserUseCase = moduleRef.get(GetClientByUserUseCase);
    addCoffeeCoinsUseCase = moduleRef.get(AddCoffeeCoinsToClientUseCase);
    calculateAverageRatingUseCase = moduleRef.get(
      CalculateAverageRatingUseCase,
    );
  });

  it('should create a review', async () => {
    const dto = {
      branchId: 1,
      userId: 2,
      rating: 5,
      comment: 'Todo excelente',
      imageUrls: ['img1.jpg', 'img2.jpg'],
    };

    const mockReview = {
      id: 99,
      ...dto,
      branch: mockBranch,
      client: mockClient,
    };

    jest.spyOn(getBranchUseCase, 'execute').mockResolvedValue(mockBranch);
    jest.spyOn(getClientByUserUseCase, 'execute').mockResolvedValue(mockClient);
    jest.spyOn(reviewRepository, 'create').mockResolvedValue(mockReview);
    jest.spyOn(addCoffeeCoinsUseCase, 'execute').mockResolvedValue(mockClient);
    jest
      .spyOn(calculateAverageRatingUseCase, 'execute')
      .mockResolvedValue(undefined);

    const result = await useCase.execute(dto);

    expect(result).toEqual(mockReview);
    expect(reviewRepository.create).toHaveBeenCalledWith({
      branch: mockBranch,
      client: mockClient,
      rating: dto.rating,
      comment: dto.comment,
      image_urls: dto.imageUrls,
    });
  });

  it('should throw if branch not found', async () => {
    jest.spyOn(getBranchUseCase, 'execute').mockResolvedValue(null);

    await expect(
      useCase.execute({
        branchId: 1,
        userId: 2,
        rating: 4,
        comment: '...',
        imageUrls: [],
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw if client not found', async () => {
    jest.spyOn(getBranchUseCase, 'execute').mockResolvedValue(mockBranch);
    jest.spyOn(getClientByUserUseCase, 'execute').mockResolvedValue(null);

    await expect(
      useCase.execute({
        branchId: 1,
        userId: 2,
        rating: 4,
        comment: '...',
        imageUrls: [],
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw if review creation fails', async () => {
    jest.spyOn(getBranchUseCase, 'execute').mockResolvedValue(mockBranch);
    jest.spyOn(getClientByUserUseCase, 'execute').mockResolvedValue(mockClient);
    jest
      .spyOn(reviewRepository, 'create')
      .mockResolvedValue(null as unknown as IReview);

    await expect(
      useCase.execute({
        branchId: 1,
        userId: 2,
        rating: 4,
        comment: '...',
        imageUrls: [],
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw if adding coffee coins fails', async () => {
    const dto = {
      branchId: 1,
      userId: 2,
      rating: 5,
      comment: 'Excelente servicio',
      imageUrls: [],
    };

    const mockReview = {
      id: 100,
      ...dto,
      branch: mockBranch,
      client: mockClient,
    };

    jest.spyOn(getBranchUseCase, 'execute').mockResolvedValue(mockBranch);
    jest.spyOn(getClientByUserUseCase, 'execute').mockResolvedValue(mockClient);
    jest.spyOn(reviewRepository, 'create').mockResolvedValue(mockReview);
    jest
      .spyOn(addCoffeeCoinsUseCase, 'execute')
      .mockResolvedValue(null as unknown as IClient);

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
  });
});
