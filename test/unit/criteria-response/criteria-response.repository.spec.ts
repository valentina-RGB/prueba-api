import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CriteriaResponseEntity } from 'src/modules/stores/infrastructure/entities/criteria-response.entity';
import { CriteriaResponseRepository } from 'src/modules/stores/infrastructure/repositories/criteria-response.repository';
import { Repository } from 'typeorm';

describe('CriteriaResponseRepository', () => {
  let repository: CriteriaResponseRepository;
  let ormRepo: Repository<CriteriaResponseEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CriteriaResponseRepository,
        {
          provide: getRepositoryToken(CriteriaResponseEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get(CriteriaResponseRepository);
    ormRepo = module.get(getRepositoryToken(CriteriaResponseEntity));
  });

  it('should create many criteria responses', async () => {
    const mockResponses = [
      {
        criteria: { id: 1 },
        approval: { id: 1 },
        response_text: 'Respuesta 1',
        image_url: 'http://img1.jpg',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        criteria: { id: 2 },
        approval: { id: 1 },
        response_text: 'Respuesta 2',
        image_url: '',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.spyOn(ormRepo, 'save').mockResolvedValue(mockResponses as any);

    const result = await repository.createMany(mockResponses as any);

    expect(result).toEqual(mockResponses);
    expect(ormRepo.save).toHaveBeenCalledWith(mockResponses);
  });
});
