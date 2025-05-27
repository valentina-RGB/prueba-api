import { ConflictException, BadRequestException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { IPersonCreateDto } from 'src/modules/users/domain/dto/person.dto.interface';
import { IPeople } from 'src/modules/users/domain/models/people.interface';
import { CreatePeopleUseCase } from 'src/modules/users/application/use-cases/people/create-people.use-case';
import {
  IPeopleRepository,
  IPeopleRepositoryToken,
} from 'src/modules/users/domain/repositories/people.repository.interface';
import { RegisterWithGoogleUseCase } from 'src/modules/users/application/use-cases/users/register-with-google.use-case';
import { CreateUserUseCase } from 'src/modules/users/application/use-cases/users/create-user.use-case';
import { QueryRunner } from 'typeorm';

describe('CreatePeopleUseCase', () => {
  let createPeopleUseCase: CreatePeopleUseCase;
  let peopleRepository: IPeopleRepository;
  let registerWithGoogleUseCase: RegisterWithGoogleUseCase;
  let createUserUseCase: CreateUserUseCase;

  const mockRole = { id: 1, name: 'Admin', status: true };
  const mockUser = {
    id: 1,
    status: true,
    email: 'admin@gmail.com',
    role: mockRole,
  };

  const mockPerson: IPeople = {
    id: 1,
    user: mockUser,
    type_document: 'ID',
    number_document: '123456',
    full_name: 'John Doe',
    phone_number: '123-456-7890',
  };

  const basePersonData: IPersonCreateDto = {
    type_document: 'ID',
    number_document: '123456',
    full_name: 'John Doe',
    phone_number: '123-456-7890',
  };

  beforeEach(async () => {
    const transactionalRepo = {
      createPeople: jest.fn().mockResolvedValue(mockPerson),
      findById: jest.fn(),
      findByIdentification: jest.fn(),
      withTransaction: jest.fn(),
    };

    const mockPeopleRepository = {
      createPeople: jest.fn().mockResolvedValue(mockPerson),
      findById: jest.fn(),
      findByIdentification: jest.fn(),
      withTransaction: jest.fn().mockReturnValue(transactionalRepo),
    };

    const mockRegisterWithGoogleUseCase = {
      execute: jest.fn().mockResolvedValue(mockUser),
    };

    const mockCreateUserUseCase = {
      execute: jest.fn().mockResolvedValue(mockUser),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePeopleUseCase,
        {
          provide: IPeopleRepositoryToken,
          useValue: mockPeopleRepository,
        },
        {
          provide: RegisterWithGoogleUseCase,
          useValue: mockRegisterWithGoogleUseCase,
        },
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
      ],
    }).compile();

    createPeopleUseCase =
      moduleFixture.get<CreatePeopleUseCase>(CreatePeopleUseCase);
    peopleRepository = moduleFixture.get<IPeopleRepository>(
      IPeopleRepositoryToken,
    );
    registerWithGoogleUseCase = moduleFixture.get<RegisterWithGoogleUseCase>(
      RegisterWithGoogleUseCase,
    );
    createUserUseCase = moduleFixture.get<CreateUserUseCase>(CreateUserUseCase);
  });

  describe('Successful creation', () => {
    it('should create a person with password registration', async () => {
      const userData = {
        email: 'admin@gmail.com',
        role: mockRole,
        password: 'securepassword',
      };

      const createdPerson: IPeople = {
        id: 1,
        user: mockUser,
        ...basePersonData,
      };

      peopleRepository.createPeople = jest
        .fn()
        .mockResolvedValue(createdPerson);

      const result = await createPeopleUseCase.execute({
        userData,
        personData: basePersonData,
      });

      expect(result).toEqual(createdPerson);
      expect(createUserUseCase.execute).toHaveBeenCalledWith({
        userData,
        queryRunner: undefined,
      });
      expect(peopleRepository.createPeople).toHaveBeenCalledWith({
        ...basePersonData,
        user: mockUser,
      });
    });

    it('should create a person with Google registration', async () => {
      const googleUser = {
        ...mockUser,
        id_google: 'google-id-123',
      };

      const userData = {
        email: 'lopez@gmail.com',
        role: mockRole,
        id_google: 'google-id-123',
      };

      const expectedPerson: IPeople = {
        id: 2,
        user: googleUser,
        ...basePersonData,
      };

      registerWithGoogleUseCase.execute = jest
        .fn()
        .mockResolvedValue(googleUser);
      peopleRepository.createPeople = jest
        .fn()
        .mockResolvedValue(expectedPerson);

      const result = await createPeopleUseCase.execute({
        userData,
        personData: basePersonData,
      });

      expect(result).toEqual(expectedPerson);
      expect(registerWithGoogleUseCase.execute).toHaveBeenCalledWith({
        userData,
        queryRunner: undefined,
      });
      expect(peopleRepository.createPeople).toHaveBeenCalledWith({
        ...basePersonData,
        user: googleUser,
      });
    });

    it('should pass queryRunner to repositories when provided', async () => {
      const mockQueryRunner = { manager: {} } as QueryRunner;
      const userData = {
        email: 'test@google.com',
        role: mockRole,
        id_google: 'google-id',
      };

      const expectedUser = { ...mockUser, id_google: 'google-id' };
      const expectedPerson = {
        id: 3,
        user: expectedUser,
        ...basePersonData,
      };

      const transactionalRepo = {
        createPeople: jest.fn().mockResolvedValue(expectedPerson),
        findById: jest.fn(),
        findByIdentification: jest.fn(),
      };

      peopleRepository.withTransaction = jest
        .fn()
        .mockReturnValue(transactionalRepo);

      registerWithGoogleUseCase.execute = jest
        .fn()
        .mockResolvedValue(expectedUser);

      const result = await createPeopleUseCase.execute({
        userData,
        personData: basePersonData,
        queryRunner: mockQueryRunner,
      });

      expect(result).toEqual(expectedPerson);
      expect(registerWithGoogleUseCase.execute).toHaveBeenCalledWith({
        userData,
        queryRunner: mockQueryRunner,
      });
      expect(transactionalRepo.createPeople).toHaveBeenCalledWith({
        ...basePersonData,
        user: expectedUser,
      });
    });
  });

  describe('Error cases', () => {
    it('should throw ConflictException when person already exists', async () => {
      const userData = {
        email: 'lopez@gmail.com',
        role: mockRole,
        password: 'securepassword',
      };

      const existingPerson = {
        ...basePersonData,
        user: mockUser,
      };

      peopleRepository.findByIdentification = jest
        .fn()
        .mockResolvedValue(existingPerson);

      const useCase = new CreatePeopleUseCase(
        peopleRepository,
        registerWithGoogleUseCase,
        createUserUseCase,
      );

      await expect(
        useCase.execute({
          userData,
          personData: basePersonData,
        }),
      ).rejects.toThrow(ConflictException);

      expect(peopleRepository.findByIdentification).toHaveBeenCalledWith(
        basePersonData.number_document,
      );
    });

    it('should throw ConflictException when person creation fails', async () => {
      const userData = {
        email: 'lopez@gmail.com',
        role: mockRole,
        password: 'securepassword',
      };

      createUserUseCase.execute = jest.fn().mockResolvedValue(mockUser);
      peopleRepository.createPeople = jest.fn().mockImplementation(() => {
        throw new ConflictException('People already exists');
      });

      await expect(
        createPeopleUseCase.execute({ userData, personData: basePersonData }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException when no valid registration method is provided', async () => {
      const userData = {
        email: 'lopez@gmail.com',
        role: mockRole,
      };

      await expect(
        createPeopleUseCase.execute({ userData, personData: basePersonData }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
