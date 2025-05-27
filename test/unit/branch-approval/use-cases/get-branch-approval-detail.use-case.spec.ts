import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import {
  IBranchApprovalRepository,
  IBranchApprovalRepositoryToken,
} from 'src/modules/stores/domain/repositories/branch-approval.repository.interface';
import { GetBranchApprovalDetailUseCase } from 'src/modules/stores/application/use-cases/branch-approval/get-branch-approval-detail.use-case';

describe('GetBranchApprovalDetailUseCase', () => {
  let getBranchApprovalDetailUseCase: GetBranchApprovalDetailUseCase;
  let approvalRepository: IBranchApprovalRepository;

  beforeEach(async () => {
    const mockApprovalRepository = {
      findLatestByBranch: jest.fn(),
    };

    const moduleFixture = await Test.createTestingModule({
      providers: [
        GetBranchApprovalDetailUseCase,
        {
          provide: IBranchApprovalRepositoryToken,
          useValue: mockApprovalRepository,
        },
      ],
    }).compile();

    getBranchApprovalDetailUseCase = moduleFixture.get(
      GetBranchApprovalDetailUseCase,
    );
    approvalRepository = moduleFixture.get(IBranchApprovalRepositoryToken);
  });

  it('should return the latest branch approval by branchId', async () => {
    const mockStore = {
      id: 1,
      name: 'Mock Store',
      type_document: 'NIT',
      number_document: '900123456',
      logo: 'mock-logo.png',
      phone_number: '3011234567',
      email: 'store@example.com',
      status: 'APPROVED',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const branchMock = {
      id: 1,
      store: mockStore,
      name: 'Main Branch',
      phone_number: '3001234567',
      latitude: 10.12345,
      longitude: -75.6789,
      address: '123 Main Street',
      average_rating: 4.5,
      is_open: true,
      status: 'APPROVED',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const approval = {
      id: 1,
      branch: branchMock,
      status: 'PENDING',
      approval_date: new Date(),
      updatedAt: new Date(),
      criteria_responses: [],
      approved_by: null,
    };

    jest
      .spyOn(approvalRepository, 'findLatestByBranch')
      .mockResolvedValue(approval);

    const result = await getBranchApprovalDetailUseCase.execute(1);

    expect(result).toEqual(approval);
    expect(approvalRepository.findLatestByBranch).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if no approval exists', async () => {
    jest
      .spyOn(approvalRepository, 'findLatestByBranch')
      .mockResolvedValue(null);

    await expect(getBranchApprovalDetailUseCase.execute(1)).rejects.toThrow(
      NotFoundException,
    );
    expect(approvalRepository.findLatestByBranch).toHaveBeenCalledWith(1);
  });
});
