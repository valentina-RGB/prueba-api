import { EmployeEntity } from 'src/modules/users/infrastructure/entities/employe.entity';
import { EmployeeRepository } from 'src/modules/users/infrastructure/repositories/employee.repository';
import { Repository, EntityManager } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';

describe('EmployeeRepository', () => {
  let repository: EmployeeRepository;
  let mockRepo: jest.Mocked<Repository<EmployeEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeRepository,
        {
          provide: getRepositoryToken(EmployeEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<EmployeeRepository>(EmployeeRepository);
    mockRepo = module.get(getRepositoryToken(EmployeEntity));
  });

  describe('createEmployee', () => {
    it('should create an employee successfully', async () => {
      const dto = { person: {}, branch: {} } as any;
      const savedEntity = { id: 1, ...dto } as any;

      mockRepo.save.mockResolvedValue(savedEntity);

      const result = await repository.createEmployee(dto);
      expect(result).toEqual(savedEntity);
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockRepo.save.mockRejectedValue(new Error('DB error'));

      await expect(repository.createEmployee({} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findById', () => {
    it('should return an employee with relations', async () => {
      const employee = {
        id: 1,
        person: { user: {} },
        branch: {},
      } as any;

      mockRepo.findOne.mockResolvedValue(employee);

      const result = await repository.findById(1);
      expect(result).toEqual(employee);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['person', 'person.user', 'branch'],
      });
    });
  });

  describe('findAll', () => {
    it('should return all employees with relations', async () => {
      const employees = [{ id: 1 }, { id: 2 }] as any[];

      mockRepo.find.mockResolvedValue(employees);

      const result = await repository.findAll();
      expect(result).toEqual(employees);
      expect(mockRepo.find).toHaveBeenCalledWith({
        relations: ['person', 'person.user', 'branch'],
      });
    });
  });

  describe('findByPersonId', () => {
    it('should return an employee by person id', async () => {
      const employee = {
        id: 3,
        person: { id: 99, user: {} },
        branch: {},
      } as any;

      mockRepo.findOne.mockResolvedValue(employee);

      const result = await repository.findByPersonId(99);
      expect(result).toEqual(employee);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { person: { id: 99 } },
        relations: ['person', 'person.user', 'branch'],
      });
    });
  });

  describe('withTransaction', () => {
    it('should return a new instance of EmployeeRepository with manager', () => {
      const manager = {
        getRepository: jest.fn().mockReturnValue(mockRepo),
      } as unknown as EntityManager;

      const transactional = repository.withTransaction(manager);
      expect(transactional).toBeInstanceOf(EmployeeRepository);
    });
  });
});
