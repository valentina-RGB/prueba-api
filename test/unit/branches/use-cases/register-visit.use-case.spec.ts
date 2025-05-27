import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AddStampToClientUseCase } from 'src/modules/albums/application/use-cases/stamp-client/add-stamp-to-client.use-case';
import { RegisterVisitUseCase } from 'src/modules/stores/application/use-cases/branches/register-visit.use-case';
import { IBranchRepositoryToken } from 'src/modules/stores/domain/repositories/branches.repository.interface';

describe('RegisterVisitUseCase', () => {
  let registerVisitUseCase: RegisterVisitUseCase;
  let mockBranchRepository: { findById: jest.Mock };
  let mockAddStampToClient: { execute: jest.Mock };

  beforeEach(async () => {
    mockBranchRepository = {
      findById: jest.fn(),
    };

    mockAddStampToClient = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterVisitUseCase,
        { provide: IBranchRepositoryToken, useValue: mockBranchRepository },
        { provide: AddStampToClientUseCase, useValue: mockAddStampToClient },
      ],
    }).compile();

    registerVisitUseCase = module.get<RegisterVisitUseCase>(RegisterVisitUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException if branch does not exist', async () => {
    mockBranchRepository.findById.mockResolvedValue(null);
    const visitData = {
      branchId: 1,
      latitude: 1.234,
      longitude: 2.345,
      user: { id: 123 },
    };

    await expect(registerVisitUseCase.execute(visitData))
      .rejects.toThrow(new NotFoundException('Branch not found'));
    expect(mockBranchRepository.findById).toHaveBeenCalledWith(1);
    expect(mockAddStampToClient.execute).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if branch is not approved', async () => {
    mockBranchRepository.findById.mockResolvedValue({ 
      id: 1,
      status: 'PENDING',
      latitude: 1.234,
      longitude: 2.345
    });

    const visitData = {
      branchId: 1,
      latitude: 1.234,
      longitude: 2.345,
      user: { id: 123 },
    };

    await expect(registerVisitUseCase.execute(visitData))
      .rejects.toThrow(new BadRequestException('Branch is not approved'));
    expect(mockBranchRepository.findById).toHaveBeenCalledWith(1);
    expect(mockAddStampToClient.execute).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if user is too far from the branch', async () => {
    const mockBranch = {
      id: 1,
      status: 'APPROVED',
      latitude: 10.000000,
  longitude: -75.000000,
    };
    
    mockBranchRepository.findById.mockResolvedValue(mockBranch);

    const farAwayCoordinates = {
      branchId: 1,
     latitude: 50.000100, 
  longitude: -75.000000,
      user: { id: 123 },
    };

    await expect(registerVisitUseCase.execute(farAwayCoordinates))
      .rejects.toThrow(new BadRequestException('You are too far from the branch'));
    
    expect(mockBranchRepository.findById).toHaveBeenCalledWith(1);
    expect(mockAddStampToClient.execute).not.toHaveBeenCalled();
  });

  it('should successfully register visit and return a stamp', async () => {
    const mockBranch = {
      id: 1,
      status: 'APPROVED',
      latitude: 1.234,
      longitude: 2.345,
    };

    const expectedStamp = {
      id: 1,
      client: { id: 123 },
    };

    mockBranchRepository.findById.mockResolvedValue(mockBranch);
    mockAddStampToClient.execute.mockResolvedValue(expectedStamp);

    const visitData = {
      branchId: 1,
      latitude: 1.234, 
      longitude: 2.345,
      user: { id: 123 },
    };

    const result = await registerVisitUseCase.execute(visitData);

    expect(result).toEqual(expectedStamp);
    expect(mockBranchRepository.findById).toHaveBeenCalledWith(1);
    expect(mockAddStampToClient.execute).toHaveBeenCalledWith({
      branchId: 1,
      user: { id: 123 }
    });
  });

  it('should throw BadRequestException if adding stamp fails', async () => {
    mockBranchRepository.findById.mockResolvedValue({
      id: 1,
      status: 'APPROVED',
      latitude: 1.234,
      longitude: 2.345,
    });

    mockAddStampToClient.execute.mockRejectedValue(new Error('Failed to add stamp'));

    const visitData = {
      branchId: 1,
      latitude: 1.234,
      longitude: 2.345,
      user: { id: 123 },
    };

    await expect(registerVisitUseCase.execute(visitData))
      .rejects.toThrow(new BadRequestException('Error adding stamp to client: Failed to add stamp'));
    
    expect(mockBranchRepository.findById).toHaveBeenCalledWith(1);
    expect(mockAddStampToClient.execute).toHaveBeenCalledWith({
      branchId: 1,
      user: { id: 123 }
    });
  });
});