import { Test, TestingModule } from '@nestjs/testing';
import { ListBranchesByStatusUseCase } from 'src/modules/stores/application/use-cases/branches/list-branches-by-status.use-case';
import {
  IBranchesRepository,
  IBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { IStore } from 'src/modules/stores/domain/models/store.interface';

describe('ListBranchesByStatusUseCase', () => {
  let listBranchesByStatusUseCase: ListBranchesByStatusUseCase;
  let branchRepository: IBranchesRepository;

  beforeEach(async () => {
    const mockBranchRepository = {
      findByStatus: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ListBranchesByStatusUseCase,
        {
          provide: IBranchRepositoryToken,
          useValue: mockBranchRepository,
        },
      ],
    }).compile();

    listBranchesByStatusUseCase = moduleFixture.get<ListBranchesByStatusUseCase>(
      ListBranchesByStatusUseCase,
    );
    branchRepository = moduleFixture.get<IBranchesRepository>(IBranchRepositoryToken);
  });

  it('should return branches with the given status', async () => {
    const status = 'pending';

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

    const mockBranches: IBranches[] = [
      {
        id: 1,
        name: 'Sucursal 1',
        phone_number: '3000000001',
        latitude: 1.1,
        longitude: 1.1,
        address: 'Calle 1',
        average_rating: 4.0,
        is_open: true,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        store: mockStore,
      },
      {
        id: 2,
        name: 'Sucursal 2',
        phone_number: '3000000002',
        latitude: 2.2,
        longitude: 2.2,
        address: 'Calle 2',
        average_rating: 3.5,
        is_open: true,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        store: mockStore,
      },
    ];

    jest.spyOn(branchRepository, 'findByStatus').mockResolvedValue(mockBranches);

    const result = await listBranchesByStatusUseCase.execute(status);

    expect(result).toEqual(mockBranches);
    expect(branchRepository.findByStatus).toHaveBeenCalledWith(status);
  });

  it('should return an empty list if no branches match the status', async () => {
    const status = 'approved';
    jest.spyOn(branchRepository, 'findByStatus').mockResolvedValue([]);

    const result = await listBranchesByStatusUseCase.execute(status);

    expect(result).toEqual([]);
    expect(branchRepository.findByStatus).toHaveBeenCalledWith(status);
  });

  it('should throw if repository throws an error', async () => {
    const status = 'rejected';
    const error = new Error('Database error');
    jest.spyOn(branchRepository, 'findByStatus').mockRejectedValue(error);

    await expect(listBranchesByStatusUseCase.execute(status)).rejects.toThrow('Database error');
    expect(branchRepository.findByStatus).toHaveBeenCalledWith(status);
  });
});
