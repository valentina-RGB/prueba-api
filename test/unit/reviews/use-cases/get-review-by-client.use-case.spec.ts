import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';
import { GetReviewByClientUseCase } from 'src/modules/stores/application/use-cases/reviews/get-review-by-user.use-case';
import {
  IReviewRepository,
  IReviewRepositoryToken,
} from 'src/modules/stores/domain/repositories/review.repository.interface';
import { GetClientByUserUseCase } from 'src/modules/users/application/use-cases/clients/get-client-by-user.use-case';

describe('GetReviewByClientUseCase', () => {
  let useCase: GetReviewByClientUseCase;
  let reviewRepository: jest.Mocked<IReviewRepository>;
  let getClientByUser: jest.Mocked<GetClientByUserUseCase>;

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
      findAllByClientId: jest.fn(),
    };

    const mockGetClientUseCase = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        GetReviewByClientUseCase,
        {
          provide: IReviewRepositoryToken,
          useValue: mockReviewRepository,
        },
        {
          provide: GetClientByUserUseCase,
          useValue: mockGetClientUseCase,
        },
      ],
    }).compile();

    useCase = moduleRef.get(GetReviewByClientUseCase);
    reviewRepository = moduleRef.get(IReviewRepositoryToken);
    getClientByUser = moduleRef.get(GetClientByUserUseCase);
  });

  it('should return reviews for client', async () => {
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

    getClientByUser.execute.mockResolvedValue(mockClient);
    reviewRepository.findAllByClientId.mockResolvedValue(mockReviews);

    const result = await useCase.execute(1);

    expect(result).toEqual(mockReviews);
    expect(getClientByUser.execute).toHaveBeenCalledWith(1);
    expect(reviewRepository.findAllByClientId).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if client is not found', async () => {
    getClientByUser.execute.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(NotFoundException);
    expect(getClientByUser.execute).toHaveBeenCalledWith(99);
    expect(reviewRepository.findAllByClientId).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if no reviews are found for the client', async () => {
    getClientByUser.execute.mockResolvedValue(mockClient);
    reviewRepository.findAllByClientId.mockResolvedValue([]);

    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
    expect(getClientByUser.execute).toHaveBeenCalledWith(1);
    expect(reviewRepository.findAllByClientId).toHaveBeenCalledWith(1);
  });
});
