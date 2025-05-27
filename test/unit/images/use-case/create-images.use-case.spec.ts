import { IImageRepository } from 'src/modules/stores/domain/repositories/image.repository.interface';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';
import { CreateImagesUseCase } from 'src/modules/stores/application/use-cases/images/create-images.use-case';

import { NotFoundException } from '@nestjs/common';
import { ICreateMultipleImages } from 'src/modules/stores/domain/dto/images.interface.dto';
import { IImage } from 'src/modules/stores/domain/models/images.interface';

describe('CreateImagesUseCase', () => {
  let useCase: CreateImagesUseCase;
  let mockRepo: jest.Mocked<IImageRepository>;
  let mockGetBranchUseCase: jest.Mocked<GetBranchUseCase>;

  const mockStore = {
    id: 1,
    name: 'Test Store',
    type_document: 'NIT',
    number_document: '900123456',
    logo: 'test-logo.png',
    phone_number: '3011234567',
    email: 'store@example.com',
    status: 'APPROVED',
  };

  const mockBranch = {
    id: 1,
    store: mockStore,
    name: 'New Branch',
    phone_number: '3001234567',
    latitude: 10.12345,
    longitude: -75.6789,
    address: '123 Main Street',
    status: 'APPROVED',
    is_open: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockRepo = {
      createImages: jest.fn(),
    } as any;

    mockGetBranchUseCase = {
      execute: jest.fn(),
    } as any;

    useCase = new CreateImagesUseCase(mockRepo, mockGetBranchUseCase);
  });

  it('should create multiple images for a branch', async () => {
    const dto: ICreateMultipleImages = {
      related_type: 'BRANCH',
      related_id: mockBranch.id,
      images: [
        { image_type: 'LOGO', image_url: 'url1' },
        { image_type: 'GALLERY', image_url: 'url2' },
      ],
    };

    mockGetBranchUseCase.execute.mockResolvedValue(mockBranch);
    mockRepo.createImages.mockResolvedValue([
      {
        id: 1,
        ...dto.images[0],
        related_type: 'BRANCH',
        related_id: mockBranch.id,
      },
      {
        id: 2,
        ...dto.images[1],
        related_type: 'BRANCH',
        related_id: mockBranch.id,
      },
    ] as IImage[]);

    const result = await useCase.execute(dto);

    expect(mockGetBranchUseCase.execute).toHaveBeenCalledWith(1);
    expect(mockRepo.createImages).toHaveBeenCalledWith([
      { ...dto.images[0], related_type: 'BRANCH', related_id: mockBranch.id },
      { ...dto.images[1], related_type: 'BRANCH', related_id: mockBranch.id },
    ]);
    expect(result).toHaveLength(2);
  });

  it('should throw NotFoundException if branch does not exist', async () => {
    const dto: ICreateMultipleImages = {
      related_type: 'BRANCH',
      related_id: 99,
      images: [{ image_type: 'LOGO', image_url: 'url1' }],
    };

    mockGetBranchUseCase.execute.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
    expect(mockGetBranchUseCase.execute).toHaveBeenCalledWith(99);
    expect(mockRepo.createImages).not.toHaveBeenCalled();
  });
});
