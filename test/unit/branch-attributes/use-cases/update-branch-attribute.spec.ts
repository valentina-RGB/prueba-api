import { Test, TestingModule } from '@nestjs/testing';
import { UpdateBranchAttributeUseCase } from '../../../../src/modules/stores/application/use-cases/branch-attributes/update-branch-attribute.use-case';
import { IBranchAttributeRepositoryToken } from '../../../../src/modules/stores/domain/repositories/branch-attributes.repository.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetAttributeByIdUseCase } from '../../../../src/modules/stores/application/use-cases/attributes/get-attribute-by-id.use-case';

describe('UpdateBranchAttributeUseCase', () => {
  let useCase: UpdateBranchAttributeUseCase;
  let mockBranchAttributeRepository: any;
  let mockGetAttributeUseCase: any;

  beforeEach(async () => {
    mockBranchAttributeRepository = {
      findByBranchAndAttribute: jest.fn(),
      update: jest.fn(),
    };

    mockGetAttributeUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateBranchAttributeUseCase,
        {
          provide: IBranchAttributeRepositoryToken,
          useValue: mockBranchAttributeRepository,
        },
        {
          provide: GetAttributeByIdUseCase,
          useValue: mockGetAttributeUseCase,
        },
      ],
    }).compile();

    useCase = module.get<UpdateBranchAttributeUseCase>(UpdateBranchAttributeUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if branchId or attributeId is missing', async () => {
    await expect(
      useCase.execute({
        branchId: 0,
        attributeId: 1,
        data: { value: 'test' },
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if attribute does not require response', async () => {
    mockGetAttributeUseCase.execute.mockResolvedValue({
      id: 1,
      requires_response: false,
    });

    await expect(
      useCase.execute({
        branchId: 1,
        attributeId: 1,
        data: { value: 'test' },
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if branch attribute is not found', async () => {
    mockGetAttributeUseCase.execute.mockResolvedValue({
      id: 1,
      requires_response: true,
    });

    mockBranchAttributeRepository.findByBranchAndAttribute.mockResolvedValue(null);

    await expect(
      useCase.execute({
        branchId: 1,
        attributeId: 1,
        data: { value: 'test' },
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update branch attribute successfully', async () => {
    const mockAttribute = {
      id: 1,
      requires_response: true,
    };

    const mockExistingBranchAttribute = {
      id: 1,
      value: 'old value',
    };

    const mockUpdatedBranchAttribute = {
      id: 1,
      value: 'new value',
    };

    mockGetAttributeUseCase.execute.mockResolvedValue(mockAttribute);
    mockBranchAttributeRepository.findByBranchAndAttribute.mockResolvedValue(
      mockExistingBranchAttribute,
    );
    mockBranchAttributeRepository.update.mockResolvedValue(
      mockUpdatedBranchAttribute,
    );

    const result = await useCase.execute({
      branchId: 1,
      attributeId: 1,
      data: { value: 'new value' },
    });

    expect(result).toEqual(mockUpdatedBranchAttribute);
    expect(mockBranchAttributeRepository.update).toHaveBeenCalledWith({
      ...mockExistingBranchAttribute,
      value: 'new value',
    });
  });
});