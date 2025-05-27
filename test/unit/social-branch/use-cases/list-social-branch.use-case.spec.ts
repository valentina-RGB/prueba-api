import { Test, TestingModule } from '@nestjs/testing';
import {
  ISocialBranchRepository,
  ISocialBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/social-branch.repository.interface';
import { ISocialBranch } from 'src/modules/stores/domain/models/social-branch.interface';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { ISocialNetwork } from 'src/modules/stores/domain/models/social-network.interface';
import { ListSocialBranchUseCase } from 'src/modules/stores/application/use-cases/social-branches/list-social-branch.use-case';

describe('ListSocialBranchUseCase', () => {
  let listSocialBranchUseCase: ListSocialBranchUseCase;
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

  const mockSocialBranches: ISocialBranch[] = [
    {
      id: 1,
      branch: mockBranch,
      social_network: mockSocialNetwork,
      description: 'Instagram oficial de la sucursal',
      value: '@cafeteria',
    },
    {
      id: 2,
      branch: mockBranch,
      social_network: {
        id: 2,
        name: 'Facebook',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      description: 'Facebook oficial',
      value: 'fb.com/cafeteria',
    },
  ];

  beforeEach(async () => {
    const mockRepo = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListSocialBranchUseCase,
        {
          provide: ISocialBranchRepositoryToken,
          useValue: mockRepo,
        },
      ],
    }).compile();

    listSocialBranchUseCase = module.get(ListSocialBranchUseCase);
    socialRepository = module.get(ISocialBranchRepositoryToken);
  });

  it('should return all social branches', async () => {
    jest
      .spyOn(socialRepository, 'findAll')
      .mockResolvedValue(mockSocialBranches);

    const result = await listSocialBranchUseCase.execute();

    expect(result).toEqual(mockSocialBranches);
    expect(socialRepository.findAll).toHaveBeenCalled();
  });

  it('should return empty array if no social branches found', async () => {
    jest.spyOn(socialRepository, 'findAll').mockResolvedValue([]);

    const result = await listSocialBranchUseCase.execute();

    expect(result).toEqual([]);
    expect(socialRepository.findAll).toHaveBeenCalled();
  });
});
