import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CreateBranchAttributeUseCase } from 'src/modules/stores/application/use-cases/branch-attributes/create-branch-attribute.use-case';
import { IBranchAttributeRepositoryToken } from 'src/modules/stores/domain/repositories/branch-attributes.repository.interface';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';
import { GetAttributeByIdUseCase } from 'src/modules/stores/application/use-cases/attributes/get-attribute-by-id.use-case';
import { CreateBranchAttributeDto } from 'src/modules/stores/application/dto/branch-attribute/create-branch-attribute.dto';

describe('CreateBranchAttributeUseCase', () => {
  let useCase: CreateBranchAttributeUseCase;
  let repositoryMock: any;
  let getBranchByIdUseCaseMock: any;
  let getAttributeByIdUseCaseMock: any;

  beforeEach(async () => {
    repositoryMock = {
      create: jest.fn(),
    };

    getBranchByIdUseCaseMock = {
      execute: jest.fn(),
    };

    getAttributeByIdUseCaseMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBranchAttributeUseCase,
        {
          provide: IBranchAttributeRepositoryToken,
          useValue: repositoryMock,
        },
        {
          provide: GetBranchUseCase,
          useValue: getBranchByIdUseCaseMock,
        },
        {
          provide: GetAttributeByIdUseCase,
          useValue: getAttributeByIdUseCaseMock,
        },
      ],
    }).compile();

    useCase = module.get<CreateBranchAttributeUseCase>(CreateBranchAttributeUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create branch attributes successfully', async () => {
      const dto: CreateBranchAttributeDto = {
        branchId: 1,
        attributes: [
          {
            attributeId: 101,
            value: 'Value 1',
          },
          {
            attributeId: 102,
            value: 'Value 2',
          },
        ],
      };

      const mockBranch = { id: 1, name: 'Test Branch' };
      const mockAttribute1 = { id: 101, name: 'Attr 1' };
      const mockAttribute2 = { id: 102, name: 'Attr 2' };

      const mockCreated1 = {
        branch: mockBranch,
        attribute: mockAttribute1,
        value: 'Value 1',
      };

      const mockCreated2 = {
        branch: mockBranch,
        attribute: mockAttribute2,
        value: 'Value 2',
      };

      getBranchByIdUseCaseMock.execute.mockResolvedValue(mockBranch);
      getAttributeByIdUseCaseMock.execute
        .mockResolvedValueOnce(mockAttribute1)
        .mockResolvedValueOnce(mockAttribute2);
      repositoryMock.create
        .mockResolvedValueOnce(mockCreated1)
        .mockResolvedValueOnce(mockCreated2);

      const result = await useCase.execute(dto);

      expect(getBranchByIdUseCaseMock.execute).toHaveBeenCalledWith(dto.branchId);
      expect(getAttributeByIdUseCaseMock.execute).toHaveBeenCalledWith(101);
      expect(getAttributeByIdUseCaseMock.execute).toHaveBeenCalledWith(102);
      expect(repositoryMock.create).toHaveBeenCalledTimes(2);
      expect(result).toEqual([mockCreated1, mockCreated2]);
    });

    it('should throw NotFoundException if branch not found', async () => {
      getBranchByIdUseCaseMock.execute.mockResolvedValue(null);

      await expect(
        useCase.execute({
          branchId: 999,
          attributes: [],
        }),
      ).rejects.toThrow(NotFoundException);

      expect(getBranchByIdUseCaseMock.execute).toHaveBeenCalledWith(999);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if attribute not found', async () => {
      const dto: CreateBranchAttributeDto = {
        branchId: 1,
        attributes: [
          {
            attributeId: 404,
            value: 'Missing',
          },
        ],
      };

      const mockBranch = { id: 1, name: 'Test Branch' };

      getBranchByIdUseCaseMock.execute.mockResolvedValue(mockBranch);
      getAttributeByIdUseCaseMock.execute.mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);

      expect(getBranchByIdUseCaseMock.execute).toHaveBeenCalledWith(1);
      expect(getAttributeByIdUseCaseMock.execute).toHaveBeenCalledWith(404);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  });
});
