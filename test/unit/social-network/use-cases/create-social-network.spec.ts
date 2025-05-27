import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateSocialNetworkDto } from 'src/modules/stores/application/dto/social-Network/create-social-network.dto';
import { CreateSocialNetworkUseCase } from 'src/modules/stores/application/use-cases/social-network/create-social-network.use-case';
import { ListSocialNetworkUseCase } from 'src/modules/stores/application/use-cases/social-network/list-social-network.use-case';
import { ISocialNetwork } from 'src/modules/stores/domain/models/social-network.interface';
import {
  ISocialNetworkRepository,
  ISocialNetworkRepositoryToken,
} from 'src/modules/stores/domain/repositories/social-network.repository.interface';

describe('CreateSocialNetworkUseCase', () => {
  let useCase: CreateSocialNetworkUseCase;
  let repository: ISocialNetworkRepository;
  let listUseCase: ListSocialNetworkUseCase;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
    };

    const mockListUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSocialNetworkUseCase,
        {
          provide: ISocialNetworkRepositoryToken,
          useValue: mockRepository,
        },
        {
          provide: ListSocialNetworkUseCase,
          useValue: mockListUseCase,
        },
      ],
    }).compile();

    useCase = module.get<CreateSocialNetworkUseCase>(
      CreateSocialNetworkUseCase,
    );
    repository = module.get<ISocialNetworkRepository>(
      ISocialNetworkRepositoryToken,
    );
    listUseCase = module.get<ListSocialNetworkUseCase>(
      ListSocialNetworkUseCase,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(repository).toBeDefined();
    expect(listUseCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new social network successfully', async () => {
      const createDto: CreateSocialNetworkDto = {
        name: 'Facebook',
      };

      const mockSocialNetwork: ISocialNetwork = {
        id: 1,
        name: 'Facebook',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(listUseCase, 'execute').mockResolvedValue([]);
      jest.spyOn(repository, 'create').mockResolvedValue(mockSocialNetwork);

      const result = await useCase.execute(createDto);

      expect(result).toEqual(mockSocialNetwork);
      expect(listUseCase.execute).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw ConflictException if social network already exists', async () => {
      const createDto: CreateSocialNetworkDto = {
        name: 'Facebook',
      };

      const existingSocialNetwork: ISocialNetwork = {
        id: 1,
        name: 'Facebook',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(listUseCase, 'execute')
        .mockResolvedValue([existingSocialNetwork]);

      await expect(useCase.execute(createDto)).rejects.toThrow(
        ConflictException,
      );
      expect(listUseCase.execute).toHaveBeenCalledTimes(1);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      const createDto: CreateSocialNetworkDto = {
        name: 'Facebook',
      };

      const error = new Error('Database error');
      jest.spyOn(listUseCase, 'execute').mockResolvedValue([]);
      jest.spyOn(repository, 'create').mockRejectedValue(error);

      await expect(useCase.execute(createDto)).rejects.toThrow(error);
      expect(listUseCase.execute).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });
  });
});
