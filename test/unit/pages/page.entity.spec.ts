import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageEntity } from 'src/modules/albums/infrastructure/entities/page.entity';
import { Repository } from 'typeorm';

describe('PageRepository', () => {
  let repository: Repository<PageEntity>;

  const mockPage = {
    id: 1,
    title: 'Página 1',
    description: 'Descripción de prueba',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    album: {},
    page_stamps: [],
  };

  const mockRepo = {
    findOne: jest.fn().mockResolvedValue(mockPage),
    save: jest.fn().mockResolvedValue(mockPage),
    find: jest.fn().mockResolvedValue([mockPage]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(PageEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();

    repository = module.get<Repository<PageEntity>>(getRepositoryToken(PageEntity));
  });

  it('should find one page by id', async () => {
    const result = await repository.findOne({ where: { id: 1 } });
    expect(result).toEqual(mockPage);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should create a page', async () => {
    const result = await repository.save(mockPage);
    expect(result).toEqual(mockPage);
    expect(mockRepo.save).toHaveBeenCalledWith(mockPage);
  });

  it('should get all pages', async () => {
    const result = await repository.find();
    expect(result).toEqual([mockPage]);
    expect(mockRepo.find).toHaveBeenCalled();
  });
});
