import { Test, TestingModule } from '@nestjs/testing';
import {
  ICriteriaRepository,
  ICriteriaRepositoryToken,
} from 'src/modules/stores/domain/repositories/criteria.repository.interface';
import { ICriteria } from 'src/modules/stores/domain/models/criteria.interface';
import { NotFoundException } from '@nestjs/common';
import { GetCriteriaUseCase } from 'src/modules/stores/application/use-cases/criteria/get-criteria-by-id.use-case';

describe('GetCriteriaUseCase', () => {
  let getCriteriaUseCase: GetCriteriaUseCase;
  let criteriaRepository: ICriteriaRepository;

  const mockCriteria: ICriteria = {
    id: 1,
    name: 'Higiene',
    description: 'Debe estar limpio',
    active: true,
    requires_image: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepo = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCriteriaUseCase,
        {
          provide: ICriteriaRepositoryToken,
          useValue: mockRepo,
        },
      ],
    }).compile();

    getCriteriaUseCase = module.get<GetCriteriaUseCase>(GetCriteriaUseCase);
    criteriaRepository = module.get<ICriteriaRepository>(
      ICriteriaRepositoryToken,
    );
  });

  it('should return criteria when found', async () => {
    jest.spyOn(criteriaRepository, 'findById').mockResolvedValue(mockCriteria);

    const result = await getCriteriaUseCase.execute(1);

    expect(result).toEqual(mockCriteria);
    expect(criteriaRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when criteria is not found', async () => {
    jest.spyOn(criteriaRepository, 'findById').mockResolvedValue(null);

    await expect(getCriteriaUseCase.execute(999)).rejects.toThrow(
      NotFoundException,
    );
    expect(criteriaRepository.findById).toHaveBeenCalledWith(999);
  });
});
