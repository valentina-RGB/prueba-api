import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageStampsEntity } from 'src/modules/albums/infrastructure/entities/page-stamps.entity';
import { Repository } from 'typeorm';

describe('PageStampsRepository', () => {
  let repository: Repository<PageStampsEntity>;

  const mockStamp = { id: 1 };
  const mockPage = { id: 1 };

  const mockPageStamp = {
    id: 1,
    page: mockPage,
    stamp: mockStamp,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepo = {
    save: jest.fn().mockResolvedValue(mockPageStamp),
    find: jest.fn().mockResolvedValue([mockPageStamp]),
    findOne: jest.fn().mockResolvedValue(mockPageStamp),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(PageStampsEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();

    repository = module.get<Repository<PageStampsEntity>>(getRepositoryToken(PageStampsEntity));
  });

  it('should save a new page-stamp relation', async () => {
    const result = await repository.save(mockPageStamp);
    expect(result).toEqual(mockPageStamp);
    expect(mockRepo.save).toHaveBeenCalledWith(mockPageStamp);
  });

  it('should find all page-stamp relations', async () => {
    const result = await repository.find();
    expect(result).toEqual([mockPageStamp]);
    expect(mockRepo.find).toHaveBeenCalled();
  });

  it('should find a page-stamp by id', async () => {
    const result = await repository.findOne({ where: { id: 1 } });
    expect(result).toEqual(mockPageStamp);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
