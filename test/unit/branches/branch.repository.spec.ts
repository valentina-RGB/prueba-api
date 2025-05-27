import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchRepository } from 'src/modules/stores/infrastructure/repositories/branch.respository';
import { BranchesEntity } from 'src/modules/stores/infrastructure/entities/branches.entity';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { IBranchesCreateDto } from 'src/modules/stores/domain/dto/branch.interface.dto';
import { StoreEntity } from 'src/modules/stores/infrastructure/entities/store.entity';

describe('BranchRepository', () => {
  let branchRepository: BranchRepository;
  let mockBranchEntityRepository: Repository<BranchesEntity>;

  beforeEach(async () => {
    const mockRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        BranchRepository,
        {
          provide: getRepositoryToken(BranchesEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    branchRepository = moduleFixture.get<BranchRepository>(BranchRepository);
    mockBranchEntityRepository = moduleFixture.get<Repository<BranchesEntity>>(
      getRepositoryToken(BranchesEntity),
    );
  });

  describe('createBranch', () => {
    it('should create a branch successfully', async () => {
      const mockStore = {
        id: 1,
        name: 'Test Store',
        type_document: 'NIT',
        number_document: '900123456',
        logo: 'test-logo.png',
        phone_number: '3011234567',
        email: 'store@example.com',
        status: 'active',
      } as StoreEntity;

      const branchData: IBranchesCreateDto = {
        store_id: 1,
        store: mockStore,
        name: 'New Branch',
        phone_number: '3001234567',
        latitude: 10.12345,
        longitude: -75.6789,
        address: '123 Main Street',
        average_rating: 4.5,
        status: 'aproved',
        social_branches: [],
      };

      const mockBranch: IBranches = {
        id: 1,
        store: mockStore,
        status: 'aproved',
        ...branchData,
        is_open: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(mockBranchEntityRepository, 'save')
        .mockResolvedValue(mockBranch as BranchesEntity);

      const result = await branchRepository.createBranch(branchData);

      expect(result).toEqual(mockBranch);
      expect(mockBranchEntityRepository.save).toHaveBeenCalledWith(branchData);
    });
  });

  describe('findById', () => {
    it('should return a branch by id successfully', async () => {
      const mockStore = {
        id: 1,
        name: 'Test Store',
        type_document: 'NIT',
        number_document: '900123456',
        logo: 'test-logo.png',
        phone_number: '3011234567',
        email: 'store@example.com',
        status: 'active',
      } as StoreEntity;

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
        status: 'aproved',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(mockBranchEntityRepository, 'findOne')
        .mockResolvedValue(mockBranch as BranchesEntity);

      const result = await branchRepository.findById(1);

      expect(result).toEqual(mockBranch);
      expect(mockBranchEntityRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [
          'store',
          'social_branches',
          'social_branches.social_network',
        ],
      });
    });

    it('should return null if no branch is found', async () => {
      jest.spyOn(mockBranchEntityRepository, 'findOne').mockResolvedValue(null);

      const result = await branchRepository.findById(99);

      expect(result).toBeNull();
      expect(mockBranchEntityRepository.findOne).toHaveBeenCalledWith({
        where: { id: 99 },
        relations: [
          'store',
          'social_branches',
          'social_branches.social_network',
        ],
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of branches successfully', async () => {
      const mockStore = {
        id: 1,
        name: 'Test Store',
        type_document: 'NIT',
        number_document: '900123456',
        logo: 'test-logo.png',
        phone_number: '3011234567',
        email: 'store@example.com',
        status: 'active',
      } as StoreEntity;

      const mockBranches = [
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
          status: 'APPROVED',
          createdAt: new Date(),
          updatedAt: new Date(),
    
        } as BranchesEntity,
        {
          id: 2,
          store: mockStore,
          name: 'Branch Two',
          phone_number: '3007654321',
          latitude: 11.12345,
          longitude: -76.6789,
          address: '456 Secondary Street',
          average_rating: 3.2,
          is_open: true,
          status: 'APPROVED',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];

      jest
        .spyOn(mockBranchEntityRepository, 'find')
        .mockResolvedValue(mockBranches as BranchesEntity[]);

      const result = await branchRepository.findAll();

      expect(result).toEqual(mockBranches);
      expect(mockBranchEntityRepository.find).toHaveBeenCalledWith({
        relations: [
          'store',
          'social_branches',
          'social_branches.social_network',
        ],
      });
    });

    it('should return an empty list if no branches are found', async () => {
      jest.spyOn(mockBranchEntityRepository, 'find').mockResolvedValue([]);

      const result = await branchRepository.findAll();

      expect(result).toEqual([]);
      expect(mockBranchEntityRepository.find).toHaveBeenCalledWith({
        relations: [
          'store',
          'social_branches',
          'social_branches.social_network',
        ],
      });
    });
  });
});
