import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetEmployeeUseCase } from 'src/modules/users/application/use-cases/employees/get-employee.use-case';
import {
  IEmployeeRepository,
  IEmployeeRepositoryToken,
} from 'src/modules/users/domain/repositories/employe.repository.interface';
import { IEmployee } from 'src/modules/users/domain/models/employe.interface';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';

describe('GetEmployeeUseCase', () => {
  let getEmployeeUseCase: GetEmployeeUseCase;
  let employeeRepository: IEmployeeRepository;

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

  beforeEach(async () => {
    const mockEmployeeRepository = {
      findById: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        GetEmployeeUseCase,
        {
          provide: IEmployeeRepositoryToken,
          useValue: mockEmployeeRepository,
        },
      ],
    }).compile();

    getEmployeeUseCase =
      moduleFixture.get<GetEmployeeUseCase>(GetEmployeeUseCase);
    employeeRepository = moduleFixture.get<IEmployeeRepository>(
      IEmployeeRepositoryToken,
    );
  });

  it('should return a employee by id successfully', async () => {
    
    const mockEmployee: IEmployee = {
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
    };

    jest.spyOn(employeeRepository, 'findById').mockResolvedValue(mockEmployee);

    const result = await getEmployeeUseCase.execute(1);

    expect(result).toEqual(mockEmployee);
    expect(employeeRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw a NotFoundException if the employee does not exist', async () => {
    jest.spyOn(employeeRepository, 'findById').mockResolvedValue(null);

    await expect(getEmployeeUseCase.execute(99)).rejects.toThrow(
      new NotFoundException('Employee not found'),
    );

    expect(employeeRepository.findById).toHaveBeenCalledWith(99);
  });
});
