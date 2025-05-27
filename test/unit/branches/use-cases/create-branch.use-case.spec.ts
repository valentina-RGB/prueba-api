import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { CreateBranchUseCase } from 'src/modules/stores/application/use-cases/branches/create-branch.use-case';
import {
  IBranchesRepository,
  IBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';
import { ListBranchUseCase } from 'src/modules/stores/application/use-cases/branches/list-branch.use-case';
import { GetStoreUseCase } from 'src/modules/stores/application/use-cases/stores/get-store.use-case';
import { CreateSocialBranchUseCase } from 'src/modules/stores/application/use-cases/social-branches/create-social-branch.use-case';
import { GetSocialNetworkUseCase } from 'src/modules/stores/application/use-cases/social-network/get-social-network-use-case';
import { ListUserUseCase } from 'src/modules/users/application/use-cases/users/list-user.use-case';
import { SendNewStoreRequestEmailUseCase } from 'src/modules/mailer/application/use-cases/send-new-branch-request.use-case';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { SendBranchProcessNotificationUseCase } from 'src/modules/mailer/application/use-cases/send-branch-process-notification.use-case';

describe('CreateBranchUseCase', () => {
  let useCase: CreateBranchUseCase;
  let branchesRepository: IBranchesRepository;
  let listBranchUseCase: ListBranchUseCase;
  let getStoreUseCase: GetStoreUseCase;
  let createSocialBranchUseCase: CreateSocialBranchUseCase;
  let getSocialNetworkUseCase: GetSocialNetworkUseCase;
  let listUsersUseCase: { execute: jest.Mock };
  let sendEmailToAdminsUseCase: { execute: jest.Mock };
  let sendProcessNotificationEmail: { execute: jest.Mock };
  let queryRunner: QueryRunner;
  let dataSource: DataSource;

  // Mock data
  const mockAdmin = [
    {
      id: 1,
      email: 'admin@example.com',
      person: { full_name: 'Admin User' },
      role: { id: 1, name: Role.ADMIN_SYS },
      status: true,
    },
  ];

  const mockSocialNetwork = {
    id: 1,
    name: 'Facebook',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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

  const mockBranch: IBranches = {
    id: 1,
    name: 'Sucursal Nueva',
    address: 'Calle 123',
    status: 'PENDING',
    latitude: 0,
    longitude: 0,
    average_rating: 0,
    phone_number: '000',
    is_open: true,
    store: mockStore,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createBranchDto = {
    name: 'Sucursal Nueva',
    address: 'Calle 123',
    latitude: 0,
    longitude: 0,
    average_rating: 0,
    phone_number: '000',
    status: 'PENDING',
    store_id: 1,
    social_branches: [
      {
        social_network_id: 1,
        value: 'https://facebook.com',
        description: '',
      },
    ],
  };

  beforeEach(async () => {
    listUsersUseCase = {
      execute: jest.fn(),
    };

    sendEmailToAdminsUseCase = {
      execute: jest.fn(),
    };

    sendProcessNotificationEmail = {
      execute: jest.fn(),
    };

    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOne: jest.fn().mockResolvedValue(mockBranch),
      },
    } as unknown as QueryRunner;

    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
    } as unknown as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBranchUseCase,
        {
          provide: IBranchRepositoryToken,
          useValue: {
            createBranch: jest.fn().mockResolvedValue(mockBranch),
          },
        },
        {
          provide: ListBranchUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: GetStoreUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockStore),
          },
        },
        {
          provide: CreateSocialBranchUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: GetSocialNetworkUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockSocialNetwork),
          },
        },
        { provide: ListUserUseCase, useValue: listUsersUseCase },
        {
          provide: SendNewStoreRequestEmailUseCase,
          useValue: sendEmailToAdminsUseCase,
        },
        {
          provide: SendBranchProcessNotificationUseCase,
          useValue: sendProcessNotificationEmail,
        },
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    useCase = module.get<CreateBranchUseCase>(CreateBranchUseCase);
    branchesRepository = module.get<IBranchesRepository>(
      IBranchRepositoryToken,
    );
    listBranchUseCase = module.get<ListBranchUseCase>(ListBranchUseCase);
    getStoreUseCase = module.get<GetStoreUseCase>(GetStoreUseCase);
    createSocialBranchUseCase = module.get<CreateSocialBranchUseCase>(
      CreateSocialBranchUseCase,
    );
    getSocialNetworkUseCase = module.get<GetSocialNetworkUseCase>(
      GetSocialNetworkUseCase,
    );
  });

  describe('success scenarios', () => {
    beforeEach(() => {
      listUsersUseCase.execute.mockResolvedValue(mockAdmin);
    });
    it('should create a branch successfully', async () => {
      const result = await useCase.execute(createBranchDto);

      expect(dataSource.createQueryRunner).toHaveBeenCalled();
      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(listBranchUseCase.execute).toHaveBeenCalled();
      expect(getStoreUseCase.execute).toHaveBeenCalledWith(
        createBranchDto.store_id,
      );
      expect(branchesRepository.createBranch).toHaveBeenCalledWith(
        { ...createBranchDto, store: mockStore },
        queryRunner.manager,
      );
      expect(queryRunner.manager.findOne).toHaveBeenCalled();
      expect(getSocialNetworkUseCase.execute).toHaveBeenCalledWith(1);
      expect(createSocialBranchUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          branch: mockBranch,
          social_network: mockSocialNetwork,
          value: 'https://facebook.com',
          description: '',
        }),
        queryRunner.manager,
      );
      expect(sendEmailToAdminsUseCase.execute).toHaveBeenCalledWith(
        mockBranch,
        ['admin@example.com'],
        ['Admin User'],
      );
      expect(sendProcessNotificationEmail.execute).toHaveBeenCalledWith(
        mockBranch,
      );
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
      expect(result).toEqual(mockBranch);
    });

    it('should create a branch without social branches', async () => {
      const dtoWithoutSocial = { ...createBranchDto, social_branches: [] };

      const result = await useCase.execute(dtoWithoutSocial);

      expect(branchesRepository.createBranch).toHaveBeenCalled();
      expect(getSocialNetworkUseCase.execute).not.toHaveBeenCalled();
      expect(createSocialBranchUseCase.execute).not.toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(result).toEqual(mockBranch);
    });
  });

  describe('error scenarios', () => {
    it('should throw ConflictException if branch name already exists', async () => {
      jest
        .spyOn(listBranchUseCase, 'execute')
        .mockResolvedValue([{ name: createBranchDto.name } as IBranches]);

      await expect(useCase.execute(createBranchDto)).rejects.toThrow(
        new ConflictException('Branch name already exists'),
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should throw ConflictException if store not found', async () => {
      jest.spyOn(getStoreUseCase, 'execute').mockResolvedValue(null);

      await expect(useCase.execute(createBranchDto)).rejects.toThrow(
        new ConflictException('Store not found'),
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should throw NotFoundException if branch not found when creating social branches', async () => {
      (queryRunner.manager.findOne as jest.Mock).mockResolvedValue(null);

      await expect(useCase.execute(createBranchDto)).rejects.toThrow(
        new NotFoundException('Branch not found'),
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should throw NotFoundException if social network not found', async () => {
      jest.spyOn(getSocialNetworkUseCase, 'execute').mockResolvedValue(null);

      await expect(useCase.execute(createBranchDto)).rejects.toThrow(
        new NotFoundException('Social Network not found'),
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should rollback transaction on unexpected error', async () => {
      const unexpectedError = new Error('Unexpected database error');
      jest
        .spyOn(branchesRepository, 'createBranch')
        .mockRejectedValue(unexpectedError);

      await expect(useCase.execute(createBranchDto)).rejects.toThrow(
        unexpectedError,
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });
});
