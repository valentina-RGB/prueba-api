import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateBranchApprovalStatusUseCase } from 'src/modules/stores/application/use-cases/branch-approval/update-branch-approval.use-case';
import { IBranchApprovalRepositoryToken } from 'src/modules/stores/domain/repositories/branch-approval.repository.interface';
import { UpdateBranchStatusUseCase } from 'src/modules/stores/application/use-cases/branches/update-branch-status.use-case';
import { SendStoreApprovedEmailUseCase } from 'src/modules/mailer/application/use-cases/send-branch-approved.use-case';
import { SendStoreRejectionEmailUseCase } from 'src/modules/mailer/application/use-cases/send-branch-rejection.use-case';
import { GetAdminByUserUseCase } from 'src/modules/users/application/use-cases/admins/get-admin-by-user.use-case';

describe('UpdateBranchApprovalStatusUseCase', () => {
  let useCase: UpdateBranchApprovalStatusUseCase;
  let branchApprovalRepoMock: any;
  let getAdminUseCaseMock: any;
  let updateBranchStatusUseCaseMock: any;
  let sendStoreApprovedEmailUseCaseMock: any;
  let sendStoreRejectionEmailUseCaseMock: any;
  let dataSourceMock: any;

  beforeEach(async () => {
    branchApprovalRepoMock = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    getAdminUseCaseMock = {
      execute: jest.fn(),
    };

    updateBranchStatusUseCaseMock = {
      execute: jest.fn(),
    };

    sendStoreApprovedEmailUseCaseMock = {
      execute: jest.fn(),
    };

    sendStoreRejectionEmailUseCaseMock = {
      execute: jest.fn(),
    };

    const queryRunnerMock = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {},
    };

    dataSourceMock = {
      createQueryRunner: jest.fn(() => queryRunnerMock),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateBranchApprovalStatusUseCase,
        {
          provide: IBranchApprovalRepositoryToken,
          useValue: branchApprovalRepoMock,
        },
        {
          provide: GetAdminByUserUseCase,
          useValue: getAdminUseCaseMock,
        },
        {
          provide: UpdateBranchStatusUseCase,
          useValue: updateBranchStatusUseCaseMock,
        },
        {
          provide: SendStoreApprovedEmailUseCase,
          useValue: sendStoreApprovedEmailUseCaseMock,
        },
        {
          provide: SendStoreRejectionEmailUseCase,
          useValue: sendStoreRejectionEmailUseCaseMock,
        },
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    useCase = module.get<UpdateBranchApprovalStatusUseCase>(
      UpdateBranchApprovalStatusUseCase,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update branch approval to APPROVED status and send approved email', async () => {
      const approvalId = 1;
      const approvedById = 10;
      const comments = 'Approval comments';

      const mockAdmin = { id: approvedById, name: 'Admin User' };
      const mockBranch = {
        id: 5,
        name: 'Test Branch',
        store: { name: 'Test Store' },
        owner: { email: 'test@example.com' },
      };
      const mockBranchApproval = {
        id: approvalId,
        branch: mockBranch,
        status: 'PENDING',
        comments: null,
        approved_by: null,
      };

      branchApprovalRepoMock.findById.mockResolvedValue({
        ...mockBranchApproval,
      });
      getAdminUseCaseMock.execute.mockResolvedValue(mockAdmin);
      updateBranchStatusUseCaseMock.execute.mockResolvedValue(mockBranch);
      sendStoreApprovedEmailUseCaseMock.execute.mockResolvedValue(true);
      branchApprovalRepoMock.update.mockResolvedValue(true);

      const result = await useCase.execute({
        approvalId,
        data: true,
        comments,
        approvedById,
      });

      expect(branchApprovalRepoMock.findById).toHaveBeenCalledWith(approvalId);
      expect(getAdminUseCaseMock.execute).toHaveBeenCalledWith(approvedById);

      expect(branchApprovalRepoMock.update).toHaveBeenCalledWith(
        approvalId,
        {
          ...mockBranchApproval,
          status: 'APPROVED',
          comments,
          approved_by: mockAdmin,
        },
        {},
      );

      expect(updateBranchStatusUseCaseMock.execute).toHaveBeenCalledWith({
        id: mockBranch.id,
        data: true,
      });

      expect(sendStoreApprovedEmailUseCaseMock.execute).toHaveBeenCalledWith(
        mockBranch,
      );
      expect(sendStoreRejectionEmailUseCaseMock.execute).not.toHaveBeenCalled();

      expect(result).toEqual({
        ...mockBranchApproval,
        status: 'APPROVED',
        comments,
        approved_by: mockAdmin,
      });

      expect(dataSourceMock.createQueryRunner).toHaveBeenCalled();
      expect(dataSourceMock.createQueryRunner().connect).toHaveBeenCalled();
      expect(
        dataSourceMock.createQueryRunner().startTransaction,
      ).toHaveBeenCalled();
      expect(
        dataSourceMock.createQueryRunner().commitTransaction,
      ).toHaveBeenCalled();
      expect(dataSourceMock.createQueryRunner().release).toHaveBeenCalled();
    });

    it('should update branch approval to REJECTED status and send rejection email', async () => {
      const approvalId = 1;
      const approvedById = 10;
      const comments = 'Rejection comments';

      const mockAdmin = { id: approvedById, name: 'Admin User' };
      const mockBranch = {
        id: 5,
        name: 'Test Branch',
        store: { name: 'Test Store' },
        owner: { email: 'test@example.com' },
      };
      const mockBranchApproval = {
        id: approvalId,
        branch: mockBranch,
        status: 'PENDING',
        comments: null,
        approved_by: null,
      };

      branchApprovalRepoMock.findById.mockResolvedValue({
        ...mockBranchApproval,
      });
      getAdminUseCaseMock.execute.mockResolvedValue(mockAdmin);
      updateBranchStatusUseCaseMock.execute.mockResolvedValue(mockBranch);
      sendStoreRejectionEmailUseCaseMock.execute.mockResolvedValue(true);
      branchApprovalRepoMock.update.mockResolvedValue(true);

      const result = await useCase.execute({
        approvalId,
        data: false,
        comments,
        approvedById,
      });

      expect(branchApprovalRepoMock.findById).toHaveBeenCalledWith(approvalId);
      expect(getAdminUseCaseMock.execute).toHaveBeenCalledWith(approvedById);

      expect(branchApprovalRepoMock.update).toHaveBeenCalledWith(
        approvalId,
        {
          ...mockBranchApproval,
          status: 'REJECTED',
          comments,
          approved_by: mockAdmin,
        },
        {},
      );

      expect(updateBranchStatusUseCaseMock.execute).toHaveBeenCalledWith({
        id: mockBranch.id,
        data: false,
      });

      expect(sendStoreRejectionEmailUseCaseMock.execute).toHaveBeenCalledWith(
        mockBranch,
        comments,
      );
      expect(sendStoreApprovedEmailUseCaseMock.execute).not.toHaveBeenCalled();

      expect(result).toEqual({
        ...mockBranchApproval,
        status: 'REJECTED',
        comments,
        approved_by: mockAdmin,
      });

      expect(
        dataSourceMock.createQueryRunner().commitTransaction,
      ).toHaveBeenCalled();
    });

    it('should throw NotFoundException when branch approval is not found', async () => {
      const approvalId = 999;
      const approvedById = 10;

      branchApprovalRepoMock.findById.mockResolvedValue(null);

      await expect(
        useCase.execute({
          approvalId,
          data: true,
          approvedById,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(branchApprovalRepoMock.findById).toHaveBeenCalledWith(approvalId);
      expect(getAdminUseCaseMock.execute).not.toHaveBeenCalled();
      expect(branchApprovalRepoMock.update).not.toHaveBeenCalled();

      expect(dataSourceMock.createQueryRunner().release).toHaveBeenCalled();
    });

    it('should throw NotFoundException when administrator is not found', async () => {
      const approvalId = 1;
      const approvedById = 999;

      const mockBranch = {
        id: 5,
        name: 'Test Branch',
        store: { name: 'Test Store' },
      };
      const mockBranchApproval = {
        id: approvalId,
        branch: mockBranch,
        status: 'PENDING',
      };

      branchApprovalRepoMock.findById.mockResolvedValue(mockBranchApproval);
      getAdminUseCaseMock.execute.mockResolvedValue(null);

      await expect(
        useCase.execute({
          approvalId,
          data: true,
          approvedById,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(branchApprovalRepoMock.findById).toHaveBeenCalledWith(approvalId);
      expect(getAdminUseCaseMock.execute).toHaveBeenCalledWith(approvedById);
      expect(branchApprovalRepoMock.update).not.toHaveBeenCalled();

      expect(
        dataSourceMock.createQueryRunner().rollbackTransaction,
      ).toHaveBeenCalled();
    });

    it('should rollback transaction if any operation fails', async () => {
      const approvalId = 1;
      const approvedById = 10;
      const comments = 'Approval comments';

      const mockAdmin = { id: approvedById, name: 'Admin User' };
      const mockBranch = {
        id: 5,
        name: 'Test Branch',
        store: { name: 'Test Store' },
        owner: { email: 'test@example.com' },
      };
      const mockBranchApproval = {
        id: approvalId,
        branch: mockBranch,
        status: 'PENDING',
        comments: null,
        approved_by: null,
      };

      branchApprovalRepoMock.findById.mockResolvedValue(mockBranchApproval);
      getAdminUseCaseMock.execute.mockResolvedValue(mockAdmin);
      updateBranchStatusUseCaseMock.execute.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(
        useCase.execute({
          approvalId,
          data: true,
          comments,
          approvedById,
        }),
      ).rejects.toThrow('Update failed');

      expect(
        dataSourceMock.createQueryRunner().rollbackTransaction,
      ).toHaveBeenCalled();
    });
  });
});
