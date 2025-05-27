import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'node:test';
import { getScheduleByBranchIdUseCase } from 'src/modules/stores/application/use-cases/branch-schedule/get-schedule-by-branch-id.use-case';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';
import { IBranchSchedule } from 'src/modules/stores/domain/models/branch-schedule.interface';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { IBranchScheduleRepositoryToken } from 'src/modules/stores/domain/repositories/branch-schedule.repository.interface';

describe('getScheduleByBranchIdUseCase', () => {
  let useCase: getScheduleByBranchIdUseCase;
  let repositoryMock: any;
  let getBranchByIdMock: any;

  beforeEach(async () => {
    repositoryMock = {
      getScheduleByBranchId: jest.fn(),
    };

    getBranchByIdMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        getScheduleByBranchIdUseCase,
        {
          provide: IBranchScheduleRepositoryToken,
          useValue: repositoryMock,
        },
        {
          provide: GetBranchUseCase,
          useValue: getBranchByIdMock,
        },
      ],
    }).compile();

    useCase = module.get<getScheduleByBranchIdUseCase>(
      getScheduleByBranchIdUseCase,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return schedules successfully', async () => {
      const mockStore = {
        id: 10,
        name: 'Test Store',
        type_document: 'NIT',
        number_document: '123456',
        logo: 'logo.png',
        phone_number: '123456789',
        email: 'test@store.com',
        status: 'ACTIVE',
      };

      const mockBranch: IBranches = {
        id: 1,
        store: mockStore,
        name: 'Test Branch',
        phone_number: '987654321',
        latitude: 40.7128,
        longitude: -74.006,
        address: '123 Main St',
        average_rating: 4.5,
        status: 'APPROVED',
        is_open: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSchedules: IBranchSchedule[] = [
        {
          id: 1,
          branch: mockBranch,
          day: 'Monday',
          open_time: '08:00',
          close_time: '17:00',
        },
        {
          id: 2,
          branch: mockBranch,
          day: 'Tuesday',
          open_time: '09:00',
          close_time: '18:00',
        },
      ];

      getBranchByIdMock.execute.mockResolvedValue(mockBranch);
      repositoryMock.getScheduleByBranchId.mockResolvedValue(mockSchedules);

      const result = await useCase.execute(mockBranch.id);

      expect(getBranchByIdMock.execute).toHaveBeenCalledWith(mockBranch.id);
      expect(repositoryMock.getScheduleByBranchId).toHaveBeenCalledWith(
        mockBranch.id,
      );
      expect(result).toEqual(mockSchedules);
    });

    it('should throw NotFoundException if branch is not found', async () => {
      getBranchByIdMock.execute.mockResolvedValue(null);

      await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);

      expect(getBranchByIdMock.execute).toHaveBeenCalledWith(999);
      expect(repositoryMock.getScheduleByBranchId).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if no schedules exist', async () => {
      const branchId = 1;
      const mockBranch = { id: branchId, name: 'Test Branch' };

      getBranchByIdMock.execute.mockResolvedValue(mockBranch);
      repositoryMock.getScheduleByBranchId.mockResolvedValue([]);

      await expect(useCase.execute(branchId)).rejects.toThrow(
        NotFoundException,
      );

      expect(getBranchByIdMock.execute).toHaveBeenCalledWith(branchId);
      expect(repositoryMock.getScheduleByBranchId).toHaveBeenCalledWith(
        branchId,
      );
    });
  });
});
