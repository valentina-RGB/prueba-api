import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { IBranchApprovalRepositoryToken } from 'src/modules/stores/domain/repositories/branch-approval.repository.interface';
import { CreateCriteriaResponseDto } from 'src/modules/stores/application/dto/criteria-response/create-criteria-response.dto';
import { CreateBranchApprovalUseCase } from 'src/modules/stores/application/use-cases/branch-approval/create-branch-approval.use-case';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';
import { CreateCriteriaResponsesUseCase } from 'src/modules/stores/application/use-cases/criteria-response/create-criteria-responses.use-case';

describe('CreateBranchApprovalUseCase', () => {
  let useCase: CreateBranchApprovalUseCase;
  let approvalRepoMock: any;
  let getBranchUseCaseMock: any;
  let createCriteriaResponsesUseCaseMock: any;

  beforeEach(async () => {
    approvalRepoMock = {
      create: jest.fn(),
    };

    getBranchUseCaseMock = {
      execute: jest.fn(),
    };

    createCriteriaResponsesUseCaseMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBranchApprovalUseCase,
        {
          provide: IBranchApprovalRepositoryToken,
          useValue: approvalRepoMock,
        },
        {
          provide: GetBranchUseCase,
          useValue: getBranchUseCaseMock,
        },
        {
          provide: CreateCriteriaResponsesUseCase,
          useValue: createCriteriaResponsesUseCaseMock,
        },
      ],
    }).compile();

    useCase = module.get<CreateBranchApprovalUseCase>(
      CreateBranchApprovalUseCase,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a branch approval successfully', async () => {
      const branchId = 1;
      const comments = 'Test comments';
      const criteriaResponseData: CreateCriteriaResponseDto[] = [
        {
          criteriaId: 1,
          response_text: 'Criteria comment',
        },
      ];

      const mockBranch = { id: branchId, name: 'Test Branch' };
      const mockApproval = {
        id: 1,
        branch: mockBranch,
        comments,
        createdAt: new Date(),
      };

      getBranchUseCaseMock.execute.mockResolvedValue(mockBranch);
      approvalRepoMock.create.mockResolvedValue(mockApproval);
      createCriteriaResponsesUseCaseMock.execute.mockResolvedValue([]);

      const result = await useCase.execute({
        branchId,
        comments,
        criteriaResponseData,
      });

      expect(getBranchUseCaseMock.execute).toHaveBeenCalledWith(branchId);
      expect(approvalRepoMock.create).toHaveBeenCalledWith({
        branch: mockBranch,
        comments,
      });
      expect(createCriteriaResponsesUseCaseMock.execute).toHaveBeenCalledWith({
        criteriaResponseData,
        approval: mockApproval,
      });
      expect(result).toEqual(mockApproval);
    });

    it('should throw NotFoundException when branch is not found', async () => {
      const branchId = 999;
      const criteriaResponseData: CreateCriteriaResponseDto[] = [];

      getBranchUseCaseMock.execute.mockResolvedValue(null);

      await expect(
        useCase.execute({
          branchId,
          criteriaResponseData,
        }),
      ).rejects.toThrow(NotFoundException);
      expect(getBranchUseCaseMock.execute).toHaveBeenCalledWith(branchId);
      expect(approvalRepoMock.create).not.toHaveBeenCalled();
      expect(createCriteriaResponsesUseCaseMock.execute).not.toHaveBeenCalled();
    });

    it('should handle the case without comments', async () => {
      const branchId = 1;
      const criteriaResponseData: CreateCriteriaResponseDto[] = [];
      const mockBranch = { id: branchId, name: 'Test Branch' };
      const mockApproval = {
        id: 1,
        branch: mockBranch,
        comments: undefined,
        createdAt: new Date(),
      };

      getBranchUseCaseMock.execute.mockResolvedValue(mockBranch);
      approvalRepoMock.create.mockResolvedValue(mockApproval);
      createCriteriaResponsesUseCaseMock.execute.mockResolvedValue([]);

      const result = await useCase.execute({
        branchId,
        criteriaResponseData,
      });

      expect(approvalRepoMock.create).toHaveBeenCalledWith({
        branch: mockBranch,
        comments: undefined,
      });
      expect(result).toEqual(mockApproval);
    });
  });
});
