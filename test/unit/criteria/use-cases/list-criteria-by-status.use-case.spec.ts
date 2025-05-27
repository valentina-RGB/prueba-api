import { Test, TestingModule } from '@nestjs/testing';
import { ListCriteriaByStatusUseCase } from 'src/modules/stores/application/use-cases/criteria/list-criteria-by-status.use-case';
import {
  ICriteriaRepository,
  ICriteriaRepositoryToken,
} from 'src/modules/stores/domain/repositories/criteria.repository.interface';
import { ICriteria } from 'src/modules/stores/domain/models/criteria.interface';

describe('ListCriteriaByStatusUseCase', () => {
  let listCriteriaByStatusUseCase: ListCriteriaByStatusUseCase;
  let criteriaRepository: ICriteriaRepository;

  const mockCriteriaList: ICriteria[] = [
    {
      id: 1,
      name: 'Higiene',
      description: 'Debe estar limpio',
      active: true,
      requires_image: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Atención',
      description: 'Buena atención al cliente',
      active: true,
      requires_image: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const mockRepo = {
      findAllByStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListCriteriaByStatusUseCase,
        {
          provide: ICriteriaRepositoryToken,
          useValue: mockRepo,
        },
      ],
    }).compile();

    listCriteriaByStatusUseCase = module.get<ListCriteriaByStatusUseCase>(
      ListCriteriaByStatusUseCase,
    );
    criteriaRepository = module.get<ICriteriaRepository>(
      ICriteriaRepositoryToken,
    );
  });

  it('should return a list of criteria with the given status', async () => {
    jest
      .spyOn(criteriaRepository, 'findAllByStatus')
      .mockResolvedValue(mockCriteriaList);

    const result = await listCriteriaByStatusUseCase.execute(true);

    expect(result).toEqual(mockCriteriaList);
    expect(criteriaRepository.findAllByStatus).toHaveBeenCalledWith(true);
  });

  it('should return an empty array if no criteria are found', async () => {
    jest.spyOn(criteriaRepository, 'findAllByStatus').mockResolvedValue([]);

    const result = await listCriteriaByStatusUseCase.execute(false);

    expect(result).toEqual([]);
    expect(criteriaRepository.findAllByStatus).toHaveBeenCalledWith(false);
  });
});
