import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserEntity } from 'src/modules/users/infrastructure/entities/user.entity';
import { UserRepository } from 'src/modules/users/infrastructure/repositories/user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;
  let ormRepo: Repository<UserEntity>;

  const mockUser = {
    id: 1,
    email: 'john@example.com',
    password: '1234',
    role: {
      id: 1,
      name: 'Admin',
      status: true,
    },
    status: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    ormRepo = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      jest.spyOn(ormRepo, 'save').mockResolvedValue(mockUser as UserEntity);

      const result = await repository.create({
        email: mockUser.email,
        password: mockUser.password,
        role: mockUser.role,
        status: mockUser.status,
      });

      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      jest.spyOn(ormRepo, 'save').mockRejectedValue({ code: '23505' });

      await expect(
        repository.create({
          email: mockUser.email,
          password: mockUser.password,
          role: mockUser.role,
          status: mockUser.status,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      jest.spyOn(ormRepo, 'save').mockRejectedValue({ code: 'UNKNOWN' });

      await expect(
        repository.create({
          email: mockUser.email,
          password: mockUser.password,
          role: mockUser.role,
          status: mockUser.status,
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      jest.spyOn(ormRepo, 'findOne').mockResolvedValue(mockUser as UserEntity);

      const result = await repository.findByEmail(mockUser.email);

      expect(result).toEqual(mockUser);
    });
    
    it('should return null if no user is found by email', async () => {
      jest.spyOn(ormRepo, 'findOne').mockResolvedValue(null);

      const result = await repository.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      jest.spyOn(ormRepo, 'find').mockResolvedValue([mockUser as UserEntity]);

      const result = await repository.findAll();

      expect(result).toEqual([mockUser]);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateSpy = jest
        .spyOn(ormRepo, 'update')
        .mockResolvedValue({} as any);

      await repository.update(mockUser.id, {
        email: 'updated@example.com',
        role_id: 2,
      });

      expect(updateSpy).toHaveBeenCalledWith(mockUser.id, {
        email: 'updated@example.com',
        role: { id: 2 },
      });
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const deleteSpy = jest
        .spyOn(ormRepo, 'delete')
        .mockResolvedValue({} as any);

      await repository.delete(mockUser.id);

      expect(deleteSpy).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
