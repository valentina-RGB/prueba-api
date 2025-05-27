import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmployeeUseCase } from 'src/modules/users/application/use-cases/employees/create-employee.use-case';
import {
  IEmployeeRepository,
  IEmployeeRepositoryToken,
} from 'src/modules/users/domain/repositories/employe.repository.interface';
import { CreatePeopleUseCase } from 'src/modules/users/application/use-cases/people/create-people.use-case';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';
import { GetRoleByNameUseCase } from 'src/modules/users/application/use-cases/roles/get-role-by-name.use-case';
import { NotFoundException } from '@nestjs/common';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { DataSource } from 'typeorm';

describe('CreateEmployeeUseCase', () => {
  let createEmployeeUseCase: CreateEmployeeUseCase;
  let employeeRepository: IEmployeeRepository;
  let createPersonUseCase: CreatePeopleUseCase;
  let getBranchUseCase: GetBranchUseCase;
  let getRoleByNameUseCase: GetRoleByNameUseCase;
  let dataSource: DataSource;

  const mockRole = { id: 1, name: Role.EMPLOYEE, status: true };

  const mockStore = {
    id: 1,
    name: 'Test Store',
    type_document: 'NIT',
    number_document: '900123456',
    logo: 'test-logo.png',
    phone_number: '3011234567',
    email: 'store@example.com',
    status: 'APPROVED',
  };

  const mockBranch = {
    id: 1,
    store: mockStore,
    name: 'New Branch',
    phone_number: '3001234567',
    latitude: 10.12345,
    longitude: -75.6789,
    address: '123 Main Street',
    status: 'APPROVED',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPerson = {
    id: 1,
    type_document: 'CC',
    number_document: '12345678',
    full_name: 'John Doe',
    phone_number: '3001234567',
    user: {
      id: 5,
      email: 'john@example.com',
      password: '5500',
      role: mockRole,
      status: true,
    },
  };

  const mockEmployee = {
    id: 10,
    person: mockPerson,
    branch: mockBranch,
    employee_type: 'Barista',
  };

  beforeEach(async () => {
    const mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {},
    };

    const mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    const mockEmployeeRepository = {
      createEmployee: jest.fn().mockResolvedValue(mockEmployee),
      findById: jest.fn(),
      withTransaction: jest.fn().mockImplementation(() => ({
        createEmployee: jest.fn().mockResolvedValue(mockEmployee),
        findById: jest.fn(),
      })),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEmployeeUseCase,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: IEmployeeRepositoryToken,
          useValue: mockEmployeeRepository,
        },
        {
          provide: CreatePeopleUseCase,
          useValue: { execute: jest.fn().mockResolvedValue(mockPerson) },
        },
        {
          provide: GetBranchUseCase,
          useValue: { execute: jest.fn().mockResolvedValue(mockBranch) },
        },
        {
          provide: GetRoleByNameUseCase,
          useValue: { execute: jest.fn().mockResolvedValue(mockRole) },
        },
      ],
    }).compile();

    createEmployeeUseCase = moduleRef.get(CreateEmployeeUseCase);
    employeeRepository = moduleRef.get(IEmployeeRepositoryToken);
    createPersonUseCase = moduleRef.get(CreatePeopleUseCase);
    getBranchUseCase = moduleRef.get(GetBranchUseCase);
    getRoleByNameUseCase = moduleRef.get(GetRoleByNameUseCase);
    dataSource = moduleRef.get(DataSource);

    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Successful creation', () => {
    it('should create an employee successfully with generated password', async () => {
      const userData = {
        email: 'john@example.com',
        status: true,
      };

      const personData = {
        type_document: 'CC',
        number_document: '12345678',
        full_name: 'John Doe',
        phone_number: '3001234567',
      };

      const employeeData = {
        branch_id: 1,
        employee_type: 'Barista',
      };

      const result = await createEmployeeUseCase.execute({
        userData,
        personData,
        employeeData,
      });

      expect(result).toEqual(mockEmployee);
      expect(getBranchUseCase.execute).toHaveBeenCalledWith(1);
      expect(getRoleByNameUseCase.execute).toHaveBeenCalledWith(Role.EMPLOYEE);

      expect(employeeRepository.withTransaction).toHaveBeenCalled();

      const transactionalRepo = (employeeRepository.withTransaction as jest.Mock).mock.results[0].value;
      expect(transactionalRepo.createEmployee).toHaveBeenCalledWith({
        ...employeeData,
        person: mockPerson,
        branch: mockBranch,
      });
    });

    it('should handle transaction correctly on success', async () => {
      const queryRunner = dataSource.createQueryRunner();

      await createEmployeeUseCase.execute({
        userData: { email: 'john@example.com', status: true },
        personData: {
          type_document: 'CC',
          number_document: '12345678',
          full_name: 'John Doe',
          phone_number: '3001234567',
        },
        employeeData: { branch_id: 1, employee_type: 'Barista' },
      });

      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should throw NotFoundException if branch is not found', async () => {
      getBranchUseCase.execute = jest.fn().mockResolvedValue(null);

      await expect(
        createEmployeeUseCase.execute({
          userData: { email: 'john@example.com', status: true },
          personData: {
            type_document: 'CC',
            number_document: '12345678',
            full_name: 'John Doe',
            phone_number: '3001234567',
          },
          employeeData: { branch_id: 99, employee_type: 'Barista' },
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if role is not found', async () => {
      getRoleByNameUseCase.execute = jest.fn().mockResolvedValue(null);

      await expect(
        createEmployeeUseCase.execute({
          userData: { email: 'john@example.com', status: true },
          personData: {
            type_document: 'CC',
            number_document: '12345678',
            full_name: 'John Doe',
            phone_number: '3001234567',
          },
          employeeData: { branch_id: 1, employee_type: 'Barista' },
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should rollback transaction if person creation fails', async () => {
      createPersonUseCase.execute = jest
        .fn()
        .mockRejectedValue(new Error('Person creation failed'));

      await expect(
        createEmployeeUseCase.execute({
          userData: { email: 'john@example.com', status: true },
          personData: {
            type_document: 'CC',
            number_document: '12345678',
            full_name: 'John Doe',
            phone_number: '3001234567',
          },
          employeeData: { branch_id: 1, employee_type: 'Barista' },
        }),
      ).rejects.toThrow('Person creation failed');

      const queryRunner = dataSource.createQueryRunner();
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });
});
