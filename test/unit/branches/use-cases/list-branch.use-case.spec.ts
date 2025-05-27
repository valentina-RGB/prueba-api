import { Test, TestingModule } from '@nestjs/testing';
import { ListBranchUseCase } from 'src/modules/stores/application/use-cases/branches/list-branch.use-case';
import {
  IBranchesRepository,
  IBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { IStore } from 'src/modules/stores/domain/models/store.interface';

describe('ListBranchUseCase', () => {
  let listBranchUseCase: ListBranchUseCase;
  let branchRepository: IBranchesRepository;

  beforeEach(async () => {
    const mockBranchRepository = {
      findAll: jest.fn(),
      getAllSortedByProximity: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ListBranchUseCase,
        {
          provide: IBranchRepositoryToken,
          useValue: mockBranchRepository,
        },
      ],
    }).compile();

    listBranchUseCase = moduleFixture.get<ListBranchUseCase>(ListBranchUseCase);
    branchRepository = moduleFixture.get<IBranchesRepository>(
      IBranchRepositoryToken,
    );
  });

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

  const mockBranches: IBranches[] = [
    {
      id: 1,
      store: mockStore,
      name: 'Branch One',
      phone_number: '3001234567',
      latitude: 10.12345,
      longitude: -75.6789,
      address: '123 Main Street',
      average_rating: 4.5,
      is_open: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it('should return branches using findAll when no lat/long is provided', async () => {
    jest.spyOn(branchRepository, 'findAll').mockResolvedValue(mockBranches);

    const result = await listBranchUseCase.execute({});

    expect(result).toEqual(mockBranches);
    expect(branchRepository.findAll).toHaveBeenCalled();
  });

  it('should return branches sorted by proximity when lat/long is provided', async () => {
    jest
      .spyOn(branchRepository, 'getAllSortedByProximity')
      .mockResolvedValue(mockBranches);

    const result = await listBranchUseCase.execute({
      lat: 10.0,
      long: -75.0,
    });

    expect(result).toEqual(mockBranches);
    expect(branchRepository.getAllSortedByProximity).toHaveBeenCalledWith(
      10.0,
      -75.0,
    );
  });

  it('should throw InternalServerErrorException if getAllSortedByProximity returns null', async () => {
    jest
      .spyOn(branchRepository, 'getAllSortedByProximity')
      .mockResolvedValue(null);

    await expect(
      listBranchUseCase.execute({ lat: 10.0, long: -75.0 }),
    ).rejects.toThrow('Error fetching branches by proximity');
  });

  it('should return an empty list if there are no branches', async () => {
    jest.spyOn(branchRepository, 'findAll').mockResolvedValue([]);

    const result = await listBranchUseCase.execute({});

    expect(result).toEqual([]);
    expect(branchRepository.findAll).toHaveBeenCalled();
  });
});
