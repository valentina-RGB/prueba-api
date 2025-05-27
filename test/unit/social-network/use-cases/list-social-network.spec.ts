import { Test, TestingModule } from '@nestjs/testing';
import { ListSocialNetworkUseCase } from 'src/modules/stores/application/use-cases/social-network/list-social-network.use-case';
import { ISocialNetwork } from 'src/modules/stores/domain/models/social-network.interface';
import { ISocialNetworkRepository, ISocialNetworkRepositoryToken } from 'src/modules/stores/domain/repositories/social-network.repository.interface';

describe('ListSocialNetworkUseCase', () => {
  let useCase: ListSocialNetworkUseCase;
  let repository: ISocialNetworkRepository;

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListSocialNetworkUseCase,
        {
          provide: ISocialNetworkRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<ListSocialNetworkUseCase>(ListSocialNetworkUseCase);
    repository = module.get<ISocialNetworkRepository>(ISocialNetworkRepositoryToken);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('execute', () => {
    it('should return a list of social networks successfully', async () => {
      const mockSocialNetworks: ISocialNetwork[] = [
        {
          id: 1,
          name: 'Facebook',
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
        {
          id: 2,
          name: 'Instagram',
          createdAt: new Date('2023-01-02'),
          updatedAt: new Date('2023-01-02'),
        },
      ];

      jest.spyOn(repository, 'findAll').mockResolvedValue(mockSocialNetworks);

      const result = await useCase.execute();

      expect(result).toEqual(mockSocialNetworks);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty list if there are no social networks', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Database error');
      jest.spyOn(repository, 'findAll').mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow(error);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});