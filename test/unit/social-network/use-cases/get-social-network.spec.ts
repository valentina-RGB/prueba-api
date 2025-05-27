import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetSocialNetworkUseCase } from 'src/modules/stores/application/use-cases/social-network/get-social-network-use-case';
import { ISocialNetwork } from 'src/modules/stores/domain/models/social-network.interface';
import { ISocialNetworkRepository, ISocialNetworkRepositoryToken } from 'src/modules/stores/domain/repositories/social-network.repository.interface';

describe('GetSocialNetworkUseCase', () => {
  let useCase: GetSocialNetworkUseCase;
  let repository: ISocialNetworkRepository;

  beforeEach(async () => {
    const mockRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSocialNetworkUseCase,
        {
          provide: ISocialNetworkRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetSocialNetworkUseCase>(GetSocialNetworkUseCase);
    repository = module.get<ISocialNetworkRepository>(ISocialNetworkRepositoryToken);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('execute', () => {
    it('should return a social network by id successfully', async () => {
      const mockSocialNetwork: ISocialNetwork = {
        id: 1,
        name: 'Facebook',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      jest.spyOn(repository, 'findById').mockResolvedValue(mockSocialNetwork);

      const result = await useCase.execute(1);

      expect(result).toEqual(mockSocialNetwork);
      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException if the social network does not exist', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      const nonExistentId = 99;
      await expect(useCase.execute(nonExistentId)).rejects.toThrow(
        new NotFoundException('Social Network not found')
      );
      expect(repository.findById).toHaveBeenCalledWith(nonExistentId);
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Database error');
      jest.spyOn(repository, 'findById').mockRejectedValue(error);

      await expect(useCase.execute(1)).rejects.toThrow(error);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });
  });
});