import { RoleEntity } from 'src/modules/users/infrastructure/entities/role.entity';
import { RoleRepository } from 'src/modules/users/infrastructure/repositories/role.repository';
import { Repository, EntityManager } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { IRole } from 'src/modules/users/domain/models/role.interface';

describe('RoleRepository', () => {
  let repository: RoleRepository;
  let ormRepo: Repository<RoleEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleRepository,
        {
          provide: getRepositoryToken(RoleEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<RoleRepository>(RoleRepository);
    ormRepo = module.get<Repository<RoleEntity>>(
      getRepositoryToken(RoleEntity),
    );
  });

  it('should create a role', async () => {
    const role: IRole = { id: 1, name: 'Admin', status: true };
    jest.spyOn(ormRepo, 'save').mockResolvedValue(role as RoleEntity);

    const result = await repository.create(role);
    expect(result).toEqual(role);
  });

  it('should throw if save fails', async () => {
    jest.spyOn(ormRepo, 'save').mockRejectedValue(new Error('DB error'));

    const role: IRole = { id: 1, name: 'Admin', status: true };

    await expect(repository.create(role)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should find a role by ID', async () => {
    const role: IRole = { id: 1, name: 'Admin', status: true };
    jest.spyOn(ormRepo, 'findOne').mockResolvedValue(role as RoleEntity);

    const result = await repository.findById(1);
    expect(result).toEqual(role);
  });

  it('should return null if role is not found by ID', async () => {
    jest.spyOn(ormRepo, 'findOne').mockResolvedValue(null);

    const result = await repository.findById(999);
    expect(result).toBeNull();
  });

  it('should find a role by name', async () => {
    const role: IRole = { id: 2, name: 'User', status: true };
    jest.spyOn(ormRepo, 'findOne').mockResolvedValue(role as RoleEntity);

    const result = await repository.findByName('User');
    expect(result).toEqual(role);
  });

  it('should return null if role is not found by name', async () => {
    jest.spyOn(ormRepo, 'findOne').mockResolvedValue(null);

    const result = await repository.findByName('Ghost');
    expect(result).toBeNull();
  });

  it('should return all roles', async () => {
    const roles: IRole[] = [
      { id: 1, name: 'Admin', status: true },
      { id: 2, name: 'User', status: true },
    ];
    jest.spyOn(ormRepo, 'find').mockResolvedValue(roles as RoleEntity[]);

    const result = await repository.findAll();
    expect(result).toEqual(roles);
  });

  it('should return new RoleRepository with transaction manager', () => {
    const mockManager: Partial<EntityManager> = {
      getRepository: jest.fn().mockReturnValue(ormRepo),
    };

    const transactionalRepo = repository.withTransaction(
      mockManager as EntityManager,
    );
    expect(transactionalRepo).toBeInstanceOf(RoleRepository);
  });
});
