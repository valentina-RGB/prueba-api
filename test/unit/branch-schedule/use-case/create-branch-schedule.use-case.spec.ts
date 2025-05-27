import { Test, TestingModule } from '@nestjs/testing';

import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateBranchScheduleUseCase } from 'src/modules/stores/application/use-cases/branch-schedule/create-branch-schedule.use-case';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';
import { IBranchScheduleRepositoryToken } from 'src/modules/stores/domain/repositories/branch-schedule.repository.interface';
import { IBranchScheduleCreateDto } from 'src/modules/stores/domain/dto/branch-schedule.interface.dto';

describe('CreateBranchScheduleUseCase', () => {
  let useCase: CreateBranchScheduleUseCase;
  let repositoryMock: any;
  let getBranchUseCaseMock: any;

  beforeEach(async () => {
    repositoryMock = {
      findByBranchAndDay: jest.fn(),
      create: jest.fn(),
    };

    getBranchUseCaseMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBranchScheduleUseCase,
        {
          provide: IBranchScheduleRepositoryToken,
          useValue: repositoryMock,
        },
        {
          provide: GetBranchUseCase,
          useValue: getBranchUseCaseMock,
        },
      ],
    }).compile();

    useCase = module.get<CreateBranchScheduleUseCase>(
      CreateBranchScheduleUseCase,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a schedule successfully', async () => {
      const dto: IBranchScheduleCreateDto = {
        branch_id: 1,
        day: 'Thursday',
        open_time: '08:00',
        close_time: '17:00',
      };

      const mockBranch = { id: 1, status: 'APPROVED' };
      const mockCreatedSchedule = { id: 4, ...dto };

      getBranchUseCaseMock.execute.mockResolvedValue(mockBranch);
      repositoryMock.findByBranchAndDay.mockResolvedValue(null);
      repositoryMock.create.mockResolvedValue(mockCreatedSchedule);

      const result = await useCase.execute(dto);

      expect(getBranchUseCaseMock.execute).toHaveBeenCalledWith(dto.branch_id);
      expect(repositoryMock.findByBranchAndDay).toHaveBeenCalledWith(
        dto.branch_id,
        dto.day,
      );
      expect(repositoryMock.create).toHaveBeenCalledWith({
        branch: mockBranch,
        day: dto.day,
        open_time: dto.open_time,
        close_time: dto.close_time,
      });

      expect(result).toEqual(mockCreatedSchedule);
    });

    it('should throw NotFoundException if branch_id is not provided', async () => {
      await expect(useCase.execute({} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if branch is not found', async () => {
      getBranchUseCaseMock.execute.mockResolvedValue(null);
      await expect(
        useCase.execute({ branch_id: 1, day: 'Monday' } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if branch is not approved', async () => {
      getBranchUseCaseMock.execute.mockResolvedValue({ status: 'PENDING' });
      await expect(
        useCase.execute({ branch_id: 1, day: 'Monday' } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if a schedule already exists for the day', async () => {
      getBranchUseCaseMock.execute.mockResolvedValue({ status: 'APPROVED' });
      repositoryMock.findByBranchAndDay.mockResolvedValue({});

      await expect(
        useCase.execute({ branch_id: 1, day: 'Wednesday' } as any),
      ).rejects.toThrow(ConflictException);
    });
  });
});
