import { Test } from '@nestjs/testing';
import { Repository, UpdateResult } from 'typeorm';
import { PeopleRepository } from 'src/modules/users/infrastructure/repositories/people.repository';
import { PeopleEntity } from 'src/modules/users/infrastructure/entities/people.entity';
import { InternalServerErrorException } from '@nestjs/common';
import {
  IPersonCreateDto,
  IPersonUpdateDto,
} from 'src/modules/users/domain/dto/person.dto.interface';
import { UserEntity } from 'src/modules/users/infrastructure/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PeopleRepository', () => {
  let peopleRepository: PeopleRepository;
  let mockRepository: jest.Mocked<Repository<PeopleEntity>>;

  const mockPerson = {
    id: 1,
    type_document: 'CC',
    number_document: '123456',
    full_name: 'John Doe',
    phone_number: '3001234567',
    user: {
      id: 1,
      email: 'test@example.com',
      password: '1234',
      status: true,
      role: { id: 1, name: 'Admin', status: true },
    } as UserEntity,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    } as unknown as jest.Mocked<Repository<PeopleEntity>>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        PeopleRepository,
        {
          provide: getRepositoryToken(PeopleEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    peopleRepository = moduleRef.get<PeopleRepository>(PeopleRepository);
  });

  describe('createPeople', () => {
    it('should create a person successfully', async () => {
      mockRepository.save!.mockResolvedValue(mockPerson as PeopleEntity);

      const result = await peopleRepository.createPeople(mockPerson);

      expect(result).toEqual(mockPerson);
      expect(mockRepository.save).toHaveBeenCalledWith(mockPerson);
    });

    it('should throw an InternalServerErrorException on save failure', async () => {
      mockRepository.save!.mockRejectedValue(new Error());

      await expect(peopleRepository.createPeople(mockPerson)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updatePeople', () => {
    const updateData: IPersonUpdateDto = {
      full_name: 'Jane Doe',
      phone_number: '9876543210',
    };

    it('should update a person successfully', async () => {
      mockRepository.update!.mockResolvedValue({ affected: 1 } as UpdateResult);

      await expect(
        peopleRepository.updatePeople(mockPerson.id, updateData),
      ).resolves.not.toThrow();
    });

    it('should throw an InternalServerErrorException on update failure', async () => {
      mockRepository.update!.mockRejectedValue(new Error());

      await expect(
        peopleRepository.updatePeople(mockPerson.id, updateData),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findById', () => {
    it('should return a person if found', async () => {
      mockRepository.findOne!.mockResolvedValue(mockPerson as PeopleEntity);

      const result = await peopleRepository.findById(mockPerson.id);

      expect(result).toEqual(mockPerson);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockPerson.id },
        relations: ['user', 'user.role'],
      });
    });

    it('should return null if not found', async () => {
      mockRepository.findOne!.mockResolvedValue(null);

      const result = await peopleRepository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all people', async () => {
      mockRepository.find!.mockResolvedValue([mockPerson as PeopleEntity]);

      const result = await peopleRepository.findAll();

      expect(result).toEqual([mockPerson]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'user.role'],
      });
    });
  });

  describe('findByIdentification', () => {
    it('should return a person by document number', async () => {
      mockRepository.findOne!.mockResolvedValue(mockPerson as PeopleEntity);

      const result = await peopleRepository.findByIdentification(
        mockPerson.number_document,
      );

      expect(result).toEqual(mockPerson);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { number_document: mockPerson.number_document },
      });
    });

    it('should return null if not found', async () => {
      mockRepository.findOne!.mockResolvedValue(null);

      const result = await peopleRepository.findByIdentification('000');

      expect(result).toBeNull();
    });
  });
});
