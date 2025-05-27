import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CriteriaEntity } from 'src/modules/stores/infrastructure/entities/criteria.entity';
import { CriteriaRepository } from 'src/modules/stores/infrastructure/repositories/criteria.repository';
import { Repository } from 'typeorm';

describe('CriteriaRepository', () => {
  let repository: CriteriaRepository;
  let ormRepo: Repository<CriteriaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CriteriaRepository,
        {
          provide: getRepositoryToken(CriteriaEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<CriteriaRepository>(CriteriaRepository);
    ormRepo = module.get<Repository<CriteriaEntity>>(
      getRepositoryToken(CriteriaEntity),
    );
  });

  it('should find a criteria by ID', async () => {
    const criteria: CriteriaEntity = {
      id: 1,
      name: 'Has bathroom',
      active: true,
      description: '',
      requires_image: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      responses: [],
    };

    jest.spyOn(ormRepo, 'findOne').mockResolvedValue(criteria);

    const result = await repository.findById(1);
    expect(result).toEqual(criteria);
  });

  it('should return null if criteria not found by ID', async () => {
    jest.spyOn(ormRepo, 'findOne').mockResolvedValue(null);

    const result = await repository.findById(999);
    expect(result).toBeNull();
  });

  it('should find all criteria by status', async () => {
    const criteriaList: CriteriaEntity[] = [
      {
        id: 1,
        name: 'Has wifi',
        active: true,
        description: '',
        requires_image: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        responses: [],
      },
      {
        id: 2,
        name: 'Has terrace',
        active: true,
        description: '',
        requires_image: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        responses: [],
      },
    ];

    jest.spyOn(ormRepo, 'find').mockResolvedValue(criteriaList);

    const result = await repository.findAllByStatus(true);
    expect(result).toEqual(criteriaList);
  });
});
