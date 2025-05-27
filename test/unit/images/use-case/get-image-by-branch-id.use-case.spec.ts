import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';
import { GetImageByBranchIdUseCase } from 'src/modules/stores/application/use-cases/images/get-image-by-branch-id.use-case';
import { IImage } from 'src/modules/stores/domain/models/images.interface';
import { IImageRepositoryToken } from 'src/modules/stores/domain/repositories/image.repository.interface';

describe('GetImageByBranchIdUseCase', () => {
  let useCase: GetImageByBranchIdUseCase;
  let repositoryMock: any;
  let getBranchByIdMock: any;

  beforeEach(async () => {
    repositoryMock = {
      GetImageByBranchId: jest.fn(),
    };

    getBranchByIdMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetImageByBranchIdUseCase,
        {
          provide: IImageRepositoryToken,
          useValue: repositoryMock,
        },
        {
          provide: GetBranchUseCase,
          useValue: getBranchByIdMock,
        },
      ],
    }).compile();

    useCase = module.get<GetImageByBranchIdUseCase>(GetImageByBranchIdUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return images successfully', async () => {
      const branchId = 1;
      const mockBranch = { id: branchId, name: 'Test Branch' };
      const mockImages: IImage[] = [
        {
          id: 1,
          image_type: 'logo',
          image_url: 'http://example.com/image1.jpg',
          related_type: 'BRANCH',
          related_id: branchId,
        },
        {
          id: 2,
          image_type: 'banner',
          image_url: 'http://example.com/image2.jpg',
          related_type: 'BRANCH',
          related_id: branchId,
        },
      ];

      getBranchByIdMock.execute.mockResolvedValue(mockBranch);
      repositoryMock.GetImageByBranchId.mockResolvedValue(mockImages);

      const result = await useCase.execute(branchId);

      expect(getBranchByIdMock.execute).toHaveBeenCalledWith(branchId);
      expect(repositoryMock.GetImageByBranchId).toHaveBeenCalledWith(branchId);
      expect(result).toEqual(mockImages);
    });

    it('should throw NotFoundException if branch is not found', async () => {
      getBranchByIdMock.execute.mockResolvedValue(null);

      await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);

      expect(getBranchByIdMock.execute).toHaveBeenCalledWith(999);
      expect(repositoryMock.GetImageByBranchId).not.toHaveBeenCalled();
    });

    it('should empty array if no images exist', async () => {
      const branchId = 1;
      const mockBranch = { id: branchId, name: 'Test Branch' };

      getBranchByIdMock.execute.mockResolvedValue(mockBranch);
      repositoryMock.GetImageByBranchId.mockResolvedValue([]);
      const result = await useCase.execute(branchId);
      expect(result).toEqual([]);

      expect(getBranchByIdMock.execute).toHaveBeenCalledWith(branchId);
      expect(repositoryMock.GetImageByBranchId).toHaveBeenCalledWith(branchId);
    });
  });
});
