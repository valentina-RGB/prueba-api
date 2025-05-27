import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ISocialBranchRepository,
  ISocialBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/social-branch.repository.interface';
import { ISocialBranch } from 'src/modules/stores/domain/models/social-branch.interface';
import { CreateSocialBranchObjetsDto } from 'src/modules/stores/application/dto/social-branch/create-social-branch.dto';
import { EntityManager } from 'typeorm';
import { CreateSocialBranchUseCase } from 'src/modules/stores/application/use-cases/social-branches/create-social-branch.use-case';

describe('CreateSocialBranchUseCase', () => {
  let useCase: CreateSocialBranchUseCase;
  let socialRepository: ISocialBranchRepository;
  let mockManager: EntityManager;

  const mockStore = {
    id: 1,
    name: 'Tienda Test',
    type_document: 'NIT',
    number_document: '765455559-3',
    logo: 'logo.png',
    phone_number: '987654321',
    email: 'example@gmail.com',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockBranch = {
    store: mockStore,
    id: 1,
    name: 'Sucursal Test',
    phone_number: '123456789',
    latitude: 10.123,
    longitude: -75.456,
    average_rating: 4.5,
    address: 'Dirección de prueba',
    is_open: true,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSocialNetwork = {
    id: 1,
    name: 'Facebook',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockDto: CreateSocialBranchObjetsDto = {
    branch: mockBranch,
    social_network: mockSocialNetwork,
    description: 'Página de Instagram',
    value: '@cafeteria',
  };

  const mockSocialBranch: ISocialBranch = {
    id: 1,
    branch: {
      id: 1,
      store: {
        id: 1,
        name: 'Tienda',
        type_document: 'NIT',
        number_document: '123456789',
        logo: 'logo.png',
        phone_number: '1234567890',
        email: 'store@example.com',
        status: 'ACTIVE',
      },
      name: 'Sucursal Principal',
      phone_number: '3210000000',
      latitude: 1.234,
      longitude: -1.234,
      address: 'Calle Falsa 123',
      average_rating: 4.5,
      is_open: true,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    social_network: {
      id: 1,
      name: 'Instagram',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    description: 'Página de Instagram',
    value: '@cafeteria',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSocialBranchUseCase,
        {
          provide: ISocialBranchRepositoryToken,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(CreateSocialBranchUseCase);
    socialRepository = module.get(ISocialBranchRepositoryToken);
    mockManager = {} as EntityManager;
  });

  it('should create a social branch successfully', async () => {
    jest.spyOn(socialRepository, 'create').mockResolvedValue(mockSocialBranch);

    const result = await useCase.execute(mockDto, mockManager);

    expect(result).toEqual(mockSocialBranch);
    expect(socialRepository.create).toHaveBeenCalledWith(mockDto, mockManager);
  });

  it('should throw ConflictException when repository throws error', async () => {
    jest
      .spyOn(socialRepository, 'create')
      .mockRejectedValue(new Error('DB Error'));

    await expect(useCase.execute(mockDto, mockManager)).rejects.toThrow(
      ConflictException,
    );
  });
});
