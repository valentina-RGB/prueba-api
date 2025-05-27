import { Test, TestingModule } from '@nestjs/testing';
import {
  IBranchAttributeRepository,
  IBranchAttributeRepositoryToken,
} from 'src/modules/stores/domain/repositories/branch-attributes.repository.interface';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { IBranchAttribute } from 'src/modules/stores/domain/models/branch-attribute.interface';
import { GetBranchAttributesByBranchUseCase } from 'src/modules/stores/application/use-cases/branch-attributes/list-branch-attributes-by-branch.use-case';

describe('GetBranchAttributesByBranchUseCase', () => {
  let useCase: GetBranchAttributesByBranchUseCase;
  let mockRepo: IBranchAttributeRepository;
  let getBranchUseCase: GetBranchUseCase;

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

  const mockAttributes: IBranchAttribute[] = [
    {
      id: 1,
      branch: mockBranch,
      attribute: {
          id: 1,
          name: 'Wi-Fi',
          description: '',
          requires_response: true,
          status: false
      },
      value: 'Sí',
    },
    {
      id: 2,
      branch: mockBranch,
      attribute: {
          id: 2,
          name: 'Parqueadero',
          description: '',
          requires_response: true,
          status: false
      },
      value: 'No',
    },
  ];

  beforeEach(async () => {
    const repo = {
      findAllByBranch: jest.fn(),
    };

    const getBranchUseCaseMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBranchAttributesByBranchUseCase,
        {
          provide: IBranchAttributeRepositoryToken,
          useValue: repo,
        },
        {
          provide: GetBranchUseCase,
          useValue: getBranchUseCaseMock,
        },
      ],
    }).compile();

    useCase = module.get(GetBranchAttributesByBranchUseCase);
    mockRepo = module.get(IBranchAttributeRepositoryToken);
    getBranchUseCase = module.get(GetBranchUseCase);
  });

  it('should return attributes for a valid branch', async () => {
    jest.spyOn(getBranchUseCase, 'execute').mockResolvedValue(mockBranch);
    jest
      .spyOn(mockRepo, 'findAllByBranch')
      .mockResolvedValue(mockAttributes);

    const result = await useCase.execute(1);

    expect(result).toEqual(mockAttributes);
    expect(getBranchUseCase.execute).toHaveBeenCalledWith(1);
    expect(mockRepo.findAllByBranch).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if branch not found', async () => {
    jest.spyOn(getBranchUseCase, 'execute').mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(
      `Branch with ID 99 not found`,
    );

    expect(getBranchUseCase.execute).toHaveBeenCalledWith(99);
    expect(mockRepo.findAllByBranch).not.toHaveBeenCalled();
  });
});
