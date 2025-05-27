import { Test, TestingModule } from '@nestjs/testing';
import {
  ISocialBranchRepository,
  ISocialBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/social-branch.repository.interface';
import { ISocialBranch } from 'src/modules/stores/domain/models/social-branch.interface';
import { NotFoundException } from '@nestjs/common';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { ISocialNetwork } from 'src/modules/stores/domain/models/social-network.interface';
import { GetSocialBranchUseCase } from 'src/modules/stores/application/use-cases/social-branches/get-social-branch.use-case';

describe('GetSocialBranchUseCase', () => {
  let getSocialBranchUseCase: GetSocialBranchUseCase;
  let socialRepository: ISocialBranchRepository;

  const mockBranch: IBranches = {
    id: 1,
    store: {
      id: 1,
      name: 'Test Store',
      type_document: 'NIT',
      number_document: '123456789',
      logo: 'logo.png',
      phone_number: '1234567890',
      email: 'store@example.com',
      status: 'ACTIVE',
    },
    name: 'Main Branch',
    phone_number: '3210000000',
    latitude: 1.2345,
    longitude: -1.2345,
    address: '123 Calle Falsa',
    average_rating: 4.8,
    is_open: true,
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSocialNetwork: ISocialNetwork = {
    id: 1,
    name: 'Instagram',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSocialBranch: ISocialBranch = {
    id: 1,
    branch: mockBranch,
    social_network: mockSocialNetwork,
    description: 'Instagram oficial de la sucursal',
    value: '@cafeteria',
  };

  beforeEach(async () => {
    const mockRepo = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSocialBranchUseCase,
        {
          provide: ISocialBranchRepositoryToken,
          useValue: mockRepo,
        },
      ],
    }).compile();

    getSocialBranchUseCase = module.get(GetSocialBranchUseCase);
    socialRepository = module.get(ISocialBranchRepositoryToken);
  });

  it('should return the social branch if found', async () => {
    jest
      .spyOn(socialRepository, 'findById')
      .mockResolvedValue(mockSocialBranch);

    const result = await getSocialBranchUseCase.execute(1);

    expect(result).toEqual(mockSocialBranch);
    expect(socialRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if social branch is not found', async () => {
    jest.spyOn(socialRepository, 'findById').mockResolvedValue(null);

    await expect(getSocialBranchUseCase.execute(99)).rejects.toThrow(
      NotFoundException,
    );
    expect(socialRepository.findById).toHaveBeenCalledWith(99);
  });
});
