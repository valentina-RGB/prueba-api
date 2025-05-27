import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetEmployeeUseCase } from 'src/modules/users/application/use-cases/employees/get-employee.use-case';
import {
  IEmployeeRepository,
  IEmployeeRepositoryToken,
} from 'src/modules/users/domain/repositories/employe.repository.interface';
import { IEmployee } from 'src/modules/users/domain/models/employe.interface';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { ListEmployeesUseCase } from 'src/modules/users/application/use-cases/employees/list-employee.use-case';

describe('ListEmployeeUseCase', () => {
  let listEmployeeUseCase: ListEmployeesUseCase;
  let employeeRepository: IEmployeeRepository;

  beforeEach(async () => {
    const mockEmployeeRepository = {
      findAll: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ListEmployeesUseCase,
        {
          provide: IEmployeeRepositoryToken,
          useValue: mockEmployeeRepository,
        },
      ],
    }).compile();

    listEmployeeUseCase =
      moduleFixture.get<ListEmployeesUseCase>(ListEmployeesUseCase);
    employeeRepository = moduleFixture.get<IEmployeeRepository>(
      IEmployeeRepositoryToken,
    );
  });

  it('should return a list of clients successfully', async () => {
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

    const mockEmployees: IEmployee[] = [
      {
        id: 1,
        employee_type: 'Barista',
        person: {
          id: 1,
          type_document: 'CC',
          number_document: '12345678',
          full_name: 'John Doe',
          phone_number: '3001234567',
          user: {
            id: 5,
            email: 'john@example.com',
            password: '1234',
            role: { id: 1, name: Role.EMPLOYEE, status: true },
            status: true,
          },
        },
        branch: {
          id: 1,
          store: mockStore,
          name: 'New Branch',
          phone_number: '3001234567',
          latitude: 10.12345,
          longitude: -75.6789,
          address: '123 Main Street',
          is_open: true,
          status: 'APPROVED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },

      {
        id: 1,
        employee_type: 'Barista',
        person: {
          id: 1,
          type_document: 'CC',
          number_document: '12345678',
          full_name: 'John Doe',
          phone_number: '3001234567',
          user: {
            id: 5,
            email: 'john@example.com',
            password: '1234',
            role: { id: 1, name: Role.EMPLOYEE, status: true },
            status: true,
          },
        },
        branch: {
          id: 1,
          store: mockStore,
          name: 'New Branch',
          phone_number: '3001234567',
          latitude: 10.12345,
          longitude: -75.6789,
          address: '123 Main Street',
          is_open: true,
          status: 'APPROVED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    ];

    jest.spyOn(employeeRepository, 'findAll').mockResolvedValue(mockEmployees);

    const result = await listEmployeeUseCase.execute();

    expect(result).toEqual(mockEmployees);
    expect(employeeRepository.findAll).toHaveBeenCalled();
  });

  it('should return an empty list if there are no clients', async () => {
    jest.spyOn(employeeRepository, 'findAll').mockResolvedValue([]);

    const result = await listEmployeeUseCase.execute();

    expect(result).toEqual([]);
    expect(employeeRepository.findAll).toHaveBeenCalled();
  });
});
